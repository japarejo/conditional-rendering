package fr.pet.rest.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by TDERVILY on 06/03/2017.
 */
@RestController
@RequestMapping("/")
public class FeatureController {

    final Map<String, Feature> featureMap = new HashMap<>(); {}

    public FeatureController() {
        featureMap.put("pet-list", new Feature(true));
        featureMap.put("pet-read", new Feature(true));
        featureMap.put("pet-edit", new Feature(true));
        featureMap.put("pet-add", new Feature(false));
        featureMap.put("pet-delete", new Feature(true));
        featureMap.put("pet-requests-remaining", new Feature(5));
        featureMap.put("pet-allowed-types", new Feature("dog cat bird snake"));

    }

    @CrossOrigin
    @RequestMapping(value = "/feature", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Feature>> list(@RequestBody List<String> features) {
        Map<String, Feature> result = new HashMap<>();
        for (String feature : features) {
            if (featureMap.containsKey(feature)) {
                result.put(feature, featureMap.get(feature));
            }
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
