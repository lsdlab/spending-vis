var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/spending-vis-backend';

var _ = require('underscore');
var Q = require('q');

require('../util/fourcalculation');

var entry;
getCollection().then(function(data) {
    entry = data;
}).catch(function() {
    entry = {
        'message': 'ERROR'
    };
});


/* GET home page. */
router.get('/alldata', function(req, res) {
    if (entry['message'] !== 'ERROR') {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                res.json({
                    message: 'OK',
                    data: doc
                });
            } else {
                res.json({
                    message: 'ERROR',
                });
            }
        });
    } else {
        res.json({
            message: 'ERROR',
        });
    }
});

router.get('/totalamount', function(req, res) {
    if (entry['message'] !== 'ERROR') {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                var totalAmount = 0;
                _.each(doc, function(item) {
                    totalAmount = totalAmount.add(item.amount);
                });
                res.json({
                    message: 'OK',
                    data: {
                        'totalamount': totalAmount
                    }
                });
            } else {
                res.json({
                    message: 'ERROR',
                });
            }
        });
    } else {
        res.json({
            message: 'ERROR',
        });
    }
});

router.get('/yearamount', function(req, res) {
    if (entry['message'] !== 'ERROR') {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                var yearaAmount = {};
                var amount2014 = 0;
                var amount2015 = 0;
                var amount2016 = 0;
                _.each(doc, function(item) {
                    if (item.timestring.substring(0, 4) === '2014') {
                        amount2014 = amount2014.add(item.amount);
                    } else if (item.timestring.substring(0, 4) === '2015') {
                        amount2015 = amount2015.add(item.amount);
                    } else if (item.timestring.substring(0, 4) === '2016') {
                        amount2016 = amount2016.add(item.amount);
                    }
                    yearaAmount['2014'] = amount2014;
                    yearaAmount['2015'] = amount2015;
                    yearaAmount['2016'] = amount2016;
                });
                res.json({
                    message: 'OK',
                    data: yearaAmount
                });
            } else {
                res.json({
                    message: 'ERROR',
                });
            }
        });
    } else {
        res.json({
            message: 'ERROR',
        });
    }
});

function getCollection() {
    var getCollectionDefer = Q.defer();

    MongoClient.connect(url, function(err, db) {
        if (!err) {
            var entry = db.collection('entry');
            getCollectionDefer.resolve(entry);
        } else {
            getCollectionDefer.reject();
        }
    });

    return getCollectionDefer.promise;
}



module.exports = router;

