'use strict';

var contenthelp = require('./content-helper');
var contentextract = require('./contentful/contentextract-controller');
var push = require('./publish-controller');
var slugs = require('../../slugs.json');
var async = require('async');
var cache = require('memory-cache');
var ICS = require('ics');
var sanitizer = require('sanitizer');

var getContent = function getContent(req, res) {
  var slug = sanitizer.escape(req.params.slug);
  var options = {};
  var search = false;

  if (req.query.courseType) options.courseType = sanitizer.escape(req.query.courseType);
  if (req.query.eventType) options.eventType = sanitizer.escape(req.query.eventType);
  if (req.query.startDate) options.startDate = sanitizer.escape(req.query.startDate);
  if (req.query.endDate) options.endDate = sanitizer.escape(req.query.endDate);
  if (req.query.keyword) options.keyword = sanitizer.escape(req.query.keyword);
  if (req.query.accredted) options.accredted = sanitizer.escape(req.query.accredted);
  if (req.query.city) options.city = sanitizer.escape(req.query.city);
  if (req.query.country) options.country = sanitizer.escape(req.query.country);

  if (Object.keys(options).length > 0) search = true;

  contenthelp.getPage(slugs.slugs[slug].id, function (data, error) {
    if (data !== null && error === null) {
      if (slug === 'coursePage' || slug === 'Calendar' || slug === 'Herramientas') {
        var uid = req.headers.uid || '';
        var speciality = req.headers.speciality || '';
        var isDelegate = req.headers.isdelegate || false;
        var temp = contentextract(slug, data);
        var popularity = {};
        var userFav = [];
        var userReg = [];
        var activeElements = null;
        var type = '';
        var page = req.query.page || 1;
        var paginate = 3;
        var end = page * paginate;
        var start = end - paginate;
        var isHome = req.query.isHome || false;
        if (slug === 'coursePage') {
          type = 'course';
          activeElements = cache.get('course_popular');
        } else if (slug === 'Calendar') {
          type = 'event';
          activeElements = cache.get('event_popular');
        } else if (slug === 'Herramientas') {
          type = 'tool';
          activeElements = cache.get('tool_popular');
        }
        //This if condition is for safer side which will not satisfy. because we will load 
        //active and popular in app.ja
        if (activeElements === null) {
          push.getActiveCE(type, function (result) {
            for (var i = 0; i < result.rows.length; i++) {
              popularity[result.rows[i].id] = result.rows[i].max;
            }

            if (type === 'course') cache.put('course_popular', popularity, 900000);
            if (type === 'event') cache.put('event_popular', popularity, 900000);
            if (type === 'tool') cache.put('tool_popular', popularity, 900000);

            push.getFavorit(uid, type, function (fav) {
              // userFav = fav.rows.map(function(item){
              //     return item.type_id;
              // });
              fav.rows.forEach(function (item) {
                if (item.type === 'fav') userFav.push(item.type_id);else if (item.type && item.type === 'reg') // applies only for courses
                  userReg.push(item.type_id);
              });

              injectContent(res, { speciality: speciality, type: type, isDelegate: isDelegate }, temp, popularity, userFav, userReg, options, search, isHome, page, start, end);
            });
          });
        } else {
          popularity = activeElements;
          push.getFavorit(uid, type, function (fav) {
            fav.rows.forEach(function (item) {
              if (item.type === 'fav') userFav.push(item.type_id);else if (item.type && item.type === 'reg') // applies only for courses
                userReg.push(item.type_id);
            });

            injectContent(res, { speciality: speciality, type: type, isDelegate: isDelegate }, temp, popularity, userFav, userReg, options, search, isHome, page, start, end);
          });
        }
      } else {
        res.setHeader('Cache-Control', 'public, no-cache, no-store');
        res.header('Pragma', 'no-cache');
        res.send(contentextract(slug, data));
      }
    }
  });
};

var injectContent = function injectContent(res, typeObj, temp, popularity, userFav, userReg, options, search, isHome, page, start, end) {
  push.modifyCourseData(typeObj, temp, popularity, userFav, userReg, options, search, isHome, function (courseBox) {
    if (typeObj.type === 'course') {
      //this is to send total number of records which will be used for ui pagination
      temp.ce_length = courseBox.length;
      //truncating pages
      temp.courseBox = courseBox.length >= end ? courseBox.slice(start, end) : courseBox.slice(start);
    } else if (typeObj.type === 'event') {
      temp.ce_length = courseBox.length;
      temp.eventBox = courseBox.length >= end ? courseBox.slice(start, end) : courseBox.slice(start);
    } else if (typeObj.type === 'tool') {
      temp.ce_length = courseBox.length;
      temp.toolContent = courseBox.length >= end ? courseBox.slice(start, end) : courseBox.slice(start);
    }
    temp.searchParams = options;
    temp.page = page;
    // if(typeObj.type === 'course')
    //     contenthelp.getPage(slugs.slugs['Cursos'].id, function (data, error) {
    //         let addBanner = Object.assign({},temp,{bannerSlider:contentextract('Cursos', data).bannerSlider});
    //         res.send(addBanner);
    //     });
    // else
    res.setHeader('Cache-Control', 'public, no-cache, no-store');
    res.header('Pragma', 'no-cache');
    res.send(temp);
  });
};

var getSubContent = function getSubContent(req, res) {

  var obj = [];
  if (req.body.content) {
    var contentArray = req.body.content;
    var mockSlug = req.body.mockSlug || "subcontent";
    var getPageData = function getPageData(item, callback) {
      contenthelp.getPage(item, function (data, error) {
        if (error) callback(error, null);else callback(null, contentextract(mockSlug, data));
      });
    };

    contentArray.forEach(function (item, index) {
      obj.push(getPageData.bind(null, item));
    });

    async.parallel(obj, function (err, results) {
      if (err) res.send(err);else res.send(results);
    });
  }
};

var getIcal = function getIcal(req, res) {
  var ics = new ICS();
  if (req.body.eventObj) {
    var eveObj = req.body.eventObj;
    var icsfile = ics.buildEvent({

      start: eveObj.startDate || '2016-05-30 06:50',
      end: eveObj.endDate || '2016-05-30 15:00',
      title: eveObj.mainTitle || 'Bolder Boulder',
      description: eveObj.description || 'Event Invitation',
      organizer: { name: "sunil", email: process.env.NOREPLY_EMAIL },
      url: 'https://buit-eucan-aula-es-diab-dev.herokuapp.com',
      status: 'confirmed',
      categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
      alarms: [{ action: 'DISPLAY', trigger: '-PT24H', description: 'Reminder', repeat: true, duration: 'PT15M' }, { action: 'AUDIO', trigger: '-PT30M' }]
    });
    res.send(icsfile);
  } else {
    res.send('Data Missing');
  }
};

module.exports = {
  getContent: getContent,
  getSubContent: getSubContent,
  getIcal: getIcal
};