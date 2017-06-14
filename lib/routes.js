"use strict";

var requireAuth = require("./middlewares/auth");
var authController = require("./controllers/auth-controller");
var userinfo = require('./controllers/userinfo-controller');
var contenthelp = require('./controllers/content-helper');
var contentful = require('contentful');
var slugs = require('../slugs.json');
module.exports = function (app, express) {

    // Create API group routes
    var apiRoutes = express.Router();
    apiRoutes.post("/auth", authController.auth);
    apiRoutes.post("/register", authController.register);
    apiRoutes.get('/getuserinfo', userinfo.userinfo);
    apiRoutes.get('/validate', requireAuth, function (res, resp) {
        resp.status(200).send({
            success: true,
            msg: 'Token valid'
        });
    });
    apiRoutes.get('/getcontent/:slug', function (req, res) {
        var slug = req.params.slug;

        contenthelp.getPage(slugs.slugs[slug].id, function (data, error) {
            if (data !== null && error === null) {
                res.send(data.includes.Entry.map(function (item, index) {
                    return item.fields;
                }));
            }
        }

        // const client = contentful.createClient({
        // accessToken:'2ac70afdcc4f9d34a318080f36501061c6f9948697eac01ed5770629765c3566',
        // space: 'eu9epspp1nno',
        // })
        // // getting a specific Post 
        // client.getEntries({'sys.id': '5uPz2TZAVq0Emw0IY2EIcM','include': 3}).then((response) => {
        // // output the author name 
        //    //console.log(delete response.items);
        //  //  console.dir(response);
        //   // res.send(response);
        //     res.send(response.includes.Entry.map(function(item,index){
        //         console.dir(item.fields);
        //         return item.fields
        //     }));

        //    // res.send('Done');
        // })
        );
    });

    app.use("/api", apiRoutes);
};