var Backbone = require("backbone");

exports.Shoot = Backbone.Model.extend({

    defaults: {
        color: null
    },

    initialize: function Shoot($data){
        this.color = $data.color;
    }
});

exports.ShootCollection = Backbone.Collection.extend({
    model: exports.Shoot
});