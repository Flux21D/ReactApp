'use strict';

var assets = {};
var hyperlinks = {};
var questions = {};
var courseModules = {};
var list = {};
var temPage = {
	includes: {
		Entry: []
	}
};

module.exports = function (slug, data) {
	var pageTitle = data.items[0].fields.pageTitle;
	assets = {};
	hyperlinks = {};
	questions = {};
	temPage = {
		includes: {
			Entry: []
		}
	};
	courseModules = {};
	list = {};
	if (data.includes && data.includes.Asset) {
		data.includes.Asset.map(function (item) {
			assets[item.sys.id] = item.fields.file.url;
		});
	}

	if (slug !== 'subcontent') {
		data.includes.Entry.map(function (item) {
			if (item.sys.contentType.sys.id === "hyperlink") hyperlinks[item.sys.id] = item.fields;else if (item.sys.contentType.sys.id === "qchoices") questions[item.sys.id] = item.fields;else if (item.sys.contentType.sys.id === "courseModule") courseModules[item.sys.id] = item.fields;else if (item.sys.contentType.sys.id === "list") list[item.sys.id] = item.fields.text;else temPage.includes.Entry.push(item);
		});
		if (slug !== 'subcontent' && slug !== 'profileCourse')
			// switch (pageTitle) {
			// 	case "index":
			switch (slug) {
				case "Index":
					//return getIndexValues(data.includes);
					return getIndexValues(temPage.includes);
					break;
				default:
					return getBody('bodyContent', getBodyMeta(temPage.includes), temPage.includes);
				//return getBody('bodyContent', getBodyMeta(data.includes), data.includes);
			} else return getSubContents(data);
	} else {
		return getSubContents(data);
	}
};

var getIndexValues = function getIndexValues(includes) {

	var footer = includes.Entry.find(function (item) {
		return item.sys.contentType.sys.id === 'footer';
	});
	var body = getBodyMeta(includes);

	return Object.assign(getFooter(footer, includes), getBody('bodyContent', body, includes));
};

var getBodyMeta = function getBodyMeta(includes) {
	return includes.Entry.find(function (item) {
		return item.sys.contentType.sys.id === 'body';
	});
};

var getBody = function getBody(content, body, includes) {
	var bodyObj = {
		contentTextOnly: [],
		bannerSlider: [],
		faq: [],
		eventBox: [],
		courseBox: [],
		qchoices: [],
		toolContent: [],
		shorttext: []
	};
	var bodyIds = [];

	if (body.fields[content]) {
		bodyIds = body.fields[content].map(function (item) {
			return item.sys.id;
		});
	}

	includes.Entry.map(function (item) {
		if (item.sys.contentType.sys.id === 'contentTextOnly' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.contentTextOnly[bodyIds.indexOf(item.sys.id)] = item.fields;
		if (item.sys.contentType.sys.id === 'bannerSlider' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.bannerSlider[bodyIds.indexOf(item.sys.id)] = extractBanner(item, includes);
		if (item.sys.contentType.sys.id === 'content2col' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.columns = extractColumns(item, includes);
		if (item.sys.contentType.sys.id === 'faq' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.faq[bodyIds.indexOf(item.sys.id)] = item.fields;
		if (item.sys.contentType.sys.id === 'upcomingEventBox' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.eventBox[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields, { 'sysid': item.sys.id });
		//else if (item.sys.contentType.sys.id === 'courseBox' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.courseBox[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields,{'sysid':item.sys.id});
		if (item.sys.contentType.sys.id === 'courseBox' && bodyIds.indexOf(item.sys.id) >= 0) {
			var tempContent = Object.assign({}, item.fields);
			bodyObj.courseBox[bodyIds.indexOf(item.sys.id)] = Object.assign(tempContent, getCourseValues(item, includes));
		}
		if (item.sys.contentType.sys.id === 'imagetype' && bodyIds.indexOf(item.sys.id) >= 0) if (assets[item.fields.imagePath.sys.id]) bodyObj.imagePath = assets[item.fields.imagePath.sys.id];
		if (item.sys.contentType.sys.id === 'qchoices' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.qchoices[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields, { 'sysid': item.sys.id });
		if (item.sys.contentType.sys.id === 'toolContent' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.toolContent[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields, { 'sysid': item.sys.id });
		if (item.sys.contentType.sys.id === 'shorttext' && bodyIds.indexOf(item.sys.id) >= 0) {
			if (item.fields.reference) bodyObj.shorttext.push({ 'sysid': item.sys.id, list: getFields(item.fields.reference) });else bodyObj.shorttext.push({ 'sysid': item.sys.id, list: [] });
		}
	});

	//eliminate holes
	bodyObj.contentTextOnly = bodyObj.contentTextOnly.filter(function (x) {
		return true;
	});
	bodyObj.bannerSlider = bodyObj.bannerSlider.filter(function (x) {
		return true;
	});
	bodyObj.faq = bodyObj.faq.filter(function (x) {
		return true;
	});
	bodyObj.eventBox = bodyObj.eventBox.filter(function (x) {
		return true;
	});
	bodyObj.courseBox = bodyObj.courseBox.filter(function (x) {
		return true;
	});
	bodyObj.qchoices = bodyObj.qchoices.filter(function (x) {
		return true;
	});
	bodyObj.toolContent = bodyObj.toolContent.filter(function (x) {
		return true;
	});

	return bodyObj;
};

var extractBanner = function extractBanner(banner, includes) {
	var imagetype = [];
	var imageids = banner.fields.sliderImage.map(function (item, index) {
		return item.sys.id;
	});

	includes.Entry.map(function (item) {
		if (item.sys.contentType.sys.id === 'imagetype') {
			var imageObj = Object.assign({}, item.fields);
			//delete imageObj.imagePath;

			if (assets[imageObj.imagePath.sys.id]) imageObj.imagePath = assets[imageObj.imagePath.sys.id];
			imagetype[imageids.indexOf(item.sys.id)] = imageObj;
			var button = [];
			if (imageObj.buttonLinks) {
				imageObj.buttonLinks.map(function (item) {
					if (hyperlinks[item.sys.id]) button.push(hyperlinks[item.sys.id]);
				});
				imageObj.buttonLinks = button;
			}
		}
	});
	return imagetype.filter(function (x) {
		return true;
	});
};

var getFields = function getFields(reference) {
	return reference.map(function (item) {
		if (list[item.sys.id]) return list[item.sys.id];
	});
};
var extractColumns = function extractColumns(columns, includes) {
	var col = {};

	if (columns.fields.contentleft) col.contentleft = getBody('contentleft', columns, includes);
	if (columns.fields.contentRight) col.contentRight = getBody('contentRight', columns, includes);

	return col;
};

var getFooter = function getFooter(footer, includes) {
	var footerObj = {
		footerLinks: []
	};

	if (footer.fields.identifier && footer.fields.identifier === 'Footer') {
		footerObj.footerContent = footer.fields.description;

		var footerIds = footer.fields.footerlinks.map(function (item) {
			if (hyperlinks[item.sys.id]) footerObj.footerLinks.push(hyperlinks[item.sys.id]);
			return item.sys.id;
		});

		// includes.Entry.map(function(item){
		// 	if(item.sys.contentType.sys.id === 'hyperlink')
		// 		footerObj.footerLinks[footerIds.indexOf(item.sys.id)] = item.fields.hyperlinkText;
		// });
	}
	return footerObj;
};

var getCourseValues = function getCourseValues(item, includes) {
	var obj = {
		sysid: item.sys.id,
		couserMainBannerImage: "",
		courseModules: [],
		courseEvaluators: []
	};

	var cBannerId = item.fields.couserMainBannerImage.sys.id;
	obj.couserMainBannerImage = assets[cBannerId] ? assets[cBannerId] : "";

	if (item.fields['courseEvaluators']) item.fields['courseEvaluators'].forEach(function (item) {
		if (questions[item.sys.id]) {
			obj.courseEvaluators.push({ sysid: item.sys.id, fields: questions[item.sys.id] });
		}
	});
	item.fields['courseModules'].forEach(function (item) {
		if (courseModules[item.sys.id]) {
			var thumbnail = courseModules[item.sys.id].thumbnailImage ? courseModules[item.sys.id].thumbnailImage.sys.id : "";
			var download = courseModules[item.sys.id].asset ? courseModules[item.sys.id].asset.sys.id : "";
			var tempContent = Object.assign({}, courseModules[item.sys.id]);
			Object.assign(tempContent, {
				thumbnailImage: assets[thumbnail] ? assets[thumbnail] : "",
				asset: assets[download] ? assets[download] : ""
			});
			obj.courseModules.push({ sysid: item.sys.id, fields: tempContent });
		}
	});

	return obj;
};

var getSubContents = function getSubContents(data) {
	var obj = {};
	data.items.forEach(function (it) {
		if (it.sys.contentType.sys.id === 'materialUpload') {
			var fileId = it.fields.fileAssetUpload.sys.id;
			obj = Object.assign({}, it.fields);
			obj.sysid = it.sys.id;
			obj.fileAssetUpload = assets[fileId] ? assets[fileId] : "";
			return obj;
		}
		if (it.sys.contentType.sys.id === 'contentTextOnly') {
			obj = Object.assign({}, it.fields);
			obj.sysid = it.sys.id;
			return obj;
		}
		if (it.sys.contentType.sys.id === 'contentTextImage') {
			var imageId = it.fields.image.sys.id;
			obj = Object.assign({}, it.fields);
			obj.sysid = it.sys.id;
			obj.image = assets[imageId] ? assets[imageId] : "";
			return obj;
		}
		if (it.sys.contentType.sys.id === 'courseBox') {
			var tempObj = Object.assign({}, it.fields);
			obj = Object.assign(tempObj, getCourseValues(it, ""));
		}
	});
	return obj;
};