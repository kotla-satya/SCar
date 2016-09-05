var express = require('express');
var request = require('request');
var router = express.Router();
var baseGMUrl = 'http://gmapi.azurewebsites.net';

/**
 *Base URL for Vehicles
 *
 **/
router.get('/', function (req, res, next) {
    res.send('Vehicle Service');
});

/**
 *To Get Vehicle Details by id from GM API
 *Url : /vehicles/:id
 *Method : GET
 *URL Params : Required :id[Number]
 *Response Codes : Success(200 OK)
 *Response : {id: , color: , vin: , doorCount: }
 **/
router.get('/:id', function (req, res) {
    var options = getGMOptionsValue(req.params.id, 'getVehicleInfoService');
    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            res.status(response.status);
            res.send({error: 'Error msg' + response.error});
        } else if (body.status !== '200') {
            res.status(body.status);
            res.send({error: body.reason});
        } else {
            var data = body.data;
            var vin = data.vin.value;
            var driveTrain = data.driveTrain.value;
            var doorCount = Number(2);
            if (data.fourDoorSedan.value == 'True') {
                doorCount = Number(4);
            }
            var color = data.color.value;
            var responseJson = {id: req.params.id, color: color, vin: vin, doorCount: doorCount};
            res.send(responseJson);
        }
    });
});

/**
 *To Get Vehicle Door Details by id from GM API
 *Url : /vehicles/:id/doors
 *Method : GET
 *URL Params : Required :id[Number]
 *Response Codes : Success(200 OK)
 *Response :
 **/
router.get('/:id/doors', function (req, res) {
    var options = getGMOptionsValue(req.params.id, 'getSecurityStatusService');
    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            res.status(response.status);
            res.send({error: 'Error msg' + response.error});
        } else if (body.status !== '200') {
            res.status(body.status);
            res.send({error: body.reason});
        } else {
            var values = body.data.doors.values;
            var doorArr = [];
            values.forEach(function (entry) {
                doorArr.push({
                    location: entry.location.value,
                    locked: entry.locked.value == 'True'
                });
            });
            res.send(doorArr);
        }
    });
});

/**
 *To Get Vehicle Fuel Details by id from GM API
 *Url : /vehicles/:id/fuel
 *Method : GET
 *URL Params : Required :id[Number]
 *Response Codes : Success(200 OK)
 *Response :
 **/
router.get('/:id/fuel', function (req, res) {
    var options = getGMOptionsValue(req.params.id, 'getEnergyService');
    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            res.status(response.status);
            res.send({error: 'Error msg' + response.error});
        } else if (body.status !== '200') {
            res.status(body.status);
            res.send({error: body.reason});
        } else {
            console.log(response.statusCode);
            var data = body.data;
            var fuel = 0;
            if (data.tankLevel.type !== 'Null') {
                fuel = Number(data.tankLevel.value);
            }
            var responseJson = {percent: fuel};
            res.send(responseJson);
        }
    });

});

/**
 *To Get Vehicle Battery Details by id from GM API
 *Url : /vehicles/:id/battery
 *Method : GET
 *URL Params : Required :id[Number]
 *Response Codes : Success(200 OK)
 *Response :
 **/
router.get('/:id/battery', function (req, res) {

    var options = getGMOptionsValue(req.params.id, 'getEnergyService');
    request(options, function (error, response, body) {
        var responseJson = '';
        if (error || response.statusCode !== 200) {
            res.status(response.status);
            res.send({error: 'Error msg' + response.error});
        } else if (body.status !== '200') {
            res.status(body.status);
            res.send({error: body.reason});
        } else {
            var data = body.data;
            var battery = 0;
            if (data.batteryLevel.type !== 'Null') {
                battery = Number(data.batteryLevel.value);
            }
            responseJson = {percent: battery};
            res.send(responseJson);
        }
    });
});

/**
 *Vehicle Engine Start or Stop  by id
 *Url : /vehicles/:id/
 *Method : POST
 *URL Params : Required :id[Number]
 *Response Codes : Success(200 OK)
 *Response :
 **/
router.post('/:id/engine', function (req, res) {
    if (req.body.action !== "START" && req.body.action !== "STOP") {
        res.send({error: 'Invalid Action value, use STOP or START'});
    } else {
        var options = {
            method: 'POST',
            url: baseGMUrl + '/actionEngineService',
            headers: {'content-type': 'application/json'},
            json: {id: req.params.id, command: req.body.action + '_VEHICLE', responseType: 'JSON'}
        };
        request(options, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                res.status(response.status);
                res.send({error: 'Error msg' + response.error});
            } else if (body.status !== '200') {
                res.status(body.status);
                res.send({error: body.reason});
            } else {
                var result = 'error';
                if (body.actionResult.status === 'EXECUTED') {
                    result = 'success';
                }
                res.send({status: result});
            }
        });
    }
});


function getGMOptionsValue(vehicleID, uri) {
    return {
        method: 'POST',
        url: baseGMUrl + '/' + uri,
        headers: {'content-type': 'application/json'},
        json: {id: vehicleID, responseType: 'JSON'}
    };

}

module.exports = router;