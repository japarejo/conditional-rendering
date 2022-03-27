import axios from "axios";
import { attribute } from "lib/logic/model/Attribute";
import { feature } from "lib/logic/model/Feature";
import { NAryFunction } from "lib/logic/model/NAryFunction";

export type AttributeValue = number | string; 
export type FeatureValue = boolean | AttributeValue;

type OnCompleteCallback = (result: FeatureValue) => void;
type OnErrorCallback = () => void;

interface FeatureRequest {
  onComplete: OnCompleteCallback;
  onError: OnErrorCallback;
}

export default class FeatureRetriever {
  // request window delay in ms
  WINDOW_DELAY = 1000;
  REQUEST_TIMEOUT = 5000;
  AXIOS_INSTANCE = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: this.REQUEST_TIMEOUT,
  });

  queueMain: Record<string, FeatureRequest[]> = {};
  queueRequest: Record<string, FeatureRequest[]> = {};

  featureMap: Record<string, FeatureValue> = {};

  tickTimeout?: NodeJS.Timeout;

  tickRequestQueue() {
    console.log("Ticking...", this.queueMain);
    if (Object.keys(this.queueMain).length === 0) {
      return;
    }

    // Copy main queue to request queue, and empty queue
    this.queueRequest = { ...this.queueMain };
    this.queueMain = {};

    const ids = Object.keys(this.queueRequest);

    this.AXIOS_INSTANCE.post<Record<string, FeatureValue>>(`/feature`, ids)
      .then((response) => {
        this.processFeatureResponse(response.data);
        // Once we're done, set a new timeout.
        this.tickTimeout = setTimeout(() => this.tickRequestQueue(), this.WINDOW_DELAY);
      })
      .catch((error) => {
        console.error(error);
        // Clear all the requests
        for (const featureRequest of Object.values(this.queueRequest)) {
          for (const req of featureRequest) {
            req.onError();
          }
        }
        this.queueRequest = {};
        // We stop the queue.
        // clearInterval(this.tickInterval!);
        // delete this.tickInterval;
      });
  }

  isBoolean(value: any): value is boolean {
    return typeof value === "boolean";
  }

  isAttribute(value: any): value is AttributeValue {
    return typeof value === "string" || typeof value === "number";
  }

  /**
   * Gets the value of a boolean feature
   * @param id Id of the feature
   * @returns 
   */
  getFeature(id: string): Promise<boolean> {
    console.log("getting feature", id);
    return new Promise((resolve, reject) => {
      if (id in this.featureMap) {
        // Check if boolean
        const value = this.featureMap[id];
        this.tryResolveFeatureValue(value, resolve, false);
      } else {
        this.addFeatureToQueue(id, (v) => {
          this.tryResolveFeatureValue(v, resolve, false);
        }, reject);
      }
    });
  }

  // If we passed an object we could get better type safety
  private tryResolveFeatureValue(value: any, resolve: (x:any) => void, shouldBeAttribute: boolean)
  {
    if (shouldBeAttribute) {
      if (this.isAttribute(value)) {
        resolve(value as AttributeValue);
      }
      else {
        console.error("Feature is not an attribute", value);
      }
    } else {
      if (this.isBoolean(value)) {
        resolve(value as boolean);
      } else {
        console.error("Feature is not boolean", value);
      }
    }
  }

  getAttribute(id: string): Promise<AttributeValue> {
    return new Promise((resolve, reject) => {
      if (id in this.featureMap) {
        // Check if boolean
        const value = this.featureMap[id];
        this.tryResolveFeatureValue(value, resolve, true);
      } else {
        this.addFeatureToQueue(id, (v) => {
          this.tryResolveFeatureValue(v, resolve, true);
        }, reject);
      }
    });
  }

  /**
   * Gets the value of a feature or features. ATM A feature is considered "ON"
   * if all the features in the list are true
   * @param ids A list of ids
   * @returns A promise that resolves with the feature boolean value
   */
  evalFeatureExpression(ids: string[]): Promise<FeatureValue> {
    // console.log("Requested feature", ids);
    return new Promise(async (resolve, reject) => {
      // Iterate through ids, get every individual feature
      Promise.all(
        ids.map((id) =>
        {
          return this.getFeature(id);
        })
      )
        .then((values) => {
          // All features are true
          // TODO: !!! What if it's not a boolean feature???
          // What do we resolve to?
          resolve(values.every((v) => v));
        })
        .catch(() => {
          reject();
        });
    });
  }

  /**
   * Adds a feature request to the relevant queue.
   * @param featureId Id of the feature to retrieve
   * @returns A promise
   * that will be resolved once we know the feature value, that is, as soon as
   * the server returns it (even if we didn't request it explicitly - i.e. it
   * was returned together with a parent feature)
   */
  addFeatureToQueue(
    featureId: string,
    onComplete: OnCompleteCallback,
    onError: OnErrorCallback
  ): void {
    if (!this.tickTimeout) {
      // if the tick interval
      this.tickTimeout = setTimeout(
        () => this.tickRequestQueue(),
        this.WINDOW_DELAY
      );
    }

    if (featureId in this.queueMain) {
      // Add callback to queueMain
      this.queueMain[featureId].push({ onComplete, onError });
    } else if (featureId in this.queueRequest) {
      // Add callback to queueRequest
      this.queueRequest[featureId].push({ onComplete, onError });
    } else {
      // Add to queueMain
      this.queueMain[featureId] = [{ onComplete, onError }];
    }
  }

  /**
   * Processes the map of features that came from the server
   * @param retrievedFeatures Dictionary of retrieved features
   */
  processFeatureResponse(retrievedFeatures: Record<string, FeatureValue>) {
    console.log("received features", retrievedFeatures);
    for (const featureId of Object.keys(retrievedFeatures)) {
      // Call relevant callbacks
      this.setFeature(featureId, retrievedFeatures[featureId]);
      // Delete feature from request queue
      delete this.queueRequest[featureId];
    }
    // If request queue not empty, that means we asked for an invalid feature
    for (const featureId of Object.keys(this.queueRequest)) {
      for (const req of this.queueRequest[featureId]) {
        req.onError();
      }
      console.warn(
        `Feature ${featureId} wasn't returned by the server. Check the feature id?`
      );
      delete this.queueRequest[featureId];
    }
  }

  /**
   * Updates the feature map with the given feature, and resolves
   * relevant pending feature requests.
   * @param id Id of the feature
   * @param value Value of the feature
   */
  setFeature(id: string, value: FeatureValue) {
    this.featureMap[id] = value;
    // Call relevant pending callbacks and remove from queue
    for (const [featureId, featureRequest] of Object.entries(
      this.queueRequest
    )) {
      if (featureId === id) {
        for (const req of featureRequest) {
          req.onComplete(value);
        }
      }
    }
  }

  /**
   * Returns a NAryFunction. Useful to operate on.
   * @param id 
   * @returns A NAryFunction that resolves to a boolean feature
   */
  getLogicFeature(id: string): NAryFunction<boolean> {
    return feature(id, this);
  }

  /**
   * Returns a NAryFunction. Useful to operate on.
   * @param id 
   * @returns A NAryFunction that resolves to an attribute value.
   */
  getLogicAttribute(id: string): NAryFunction<AttributeValue> {
    return attribute(id, this);
  }
}