'use strict';

let assets = {};
let hyperlinks = {};
let questions = {};
let courseModules = {};
let shortList = {};
//let downloadPdf = [];
let temPage = {
  includes:{
    Entry:[]
  }
};

module.exports = function (slug, data) {
  const pageTitle = data.items[0].fields.pageTitle;
  assets = {};
  hyperlinks = {};
  questions = {};
  downloadPdf = [];
  temPage = {
    includes:{
      Entry:[]
    }
  };
  courseModules = {};
  shortList = {};
  if (data.includes && data.includes.Asset) {
    data.includes.Asset.map(function (item) {
      assets[item.sys.id] = item.fields.file.url;
    });
  }

  if(slug !== 'subcontent'){
    data.includes.Entry.map(function(item){
      if(item.sys.contentType.sys.id === "shorttext")
        shortList[item.sys.id] = item.fields;
      if(item.sys.contentType.sys.id === "hyperlink")
        hyperlinks[item.sys.id] = item.fields;
      else if (item.sys.contentType.sys.id === "qchoices") questions[item.sys.id] = item.fields;
      else if (item.sys.contentType.sys.id === "courseModule") courseModules[item.sys.id] = item.fields;
      else if (item.sys.contentType.sys.id === "list") shortList[item.sys.id] = item.fields.text;
      // else if (item.sys.contentType.sys.id === "fileUpload") downloadPdf[item.sys.id] = item.fields.fileName;
      else temPage.includes.Entry.push(item);
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
      }
    else
			return getSubContents(data);
  }
  else{
    return getSubContents(data);
  }	
};


const getIndexValues = function(includes) {

  const footer = includes.Entry.find(function(item){
    return item.sys.contentType.sys.id === 'footer';
  }); 
  const body = getBodyMeta(includes);

  return Object.assign(getFooter(footer,includes),getBody('bodyContent', body,includes));
}

const getBodyMeta = function(includes) {
  return includes.Entry.find(function(item){
    return item.sys.contentType.sys.id === 'body';
  });
}

const getBody = function(content,body,includes){
  var bodyObj = {
    contentTextOnly: [],
    bannerSlider: [],
    faq: [],
    eventBox: [],
    courseBox: [],
    qchoices: [],
    toolContent: [],
    shorttext: [],
    searchPanel: {}
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
    if (item.sys.contentType.sys.id === 'upcomingEventBox' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.eventBox[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields,{'sysid':item.sys.id});
		//else if (item.sys.contentType.sys.id === 'courseBox' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.courseBox[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields,{'sysid':item.sys.id});
    if (item.sys.contentType.sys.id === 'courseBox' && bodyIds.indexOf(item.sys.id) >= 0){
      let tempContent = Object.assign({},item.fields);
		 	bodyObj.courseBox[bodyIds.indexOf(item.sys.id)] = Object.assign(tempContent,getCourseValues(item, includes));
    }
    if (item.sys.contentType.sys.id === 'imagetype' && bodyIds.indexOf(item.sys.id) >= 0) if (assets[item.fields.imagePath.sys.id]) bodyObj.imagePath = assets[item.fields.imagePath.sys.id];
    if (item.sys.contentType.sys.id === 'qchoices' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.qchoices[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields,{'sysid':item.sys.id});
    if (item.sys.contentType.sys.id === 'toolContent' && bodyIds.indexOf(item.sys.id) >= 0) bodyObj.toolContent[bodyIds.indexOf(item.sys.id)] = Object.assign(item.fields,{'sysid':item.sys.id});
    if (item.sys.contentType.sys.id === 'shorttext' && bodyIds.indexOf(item.sys.id) >= 0) {
      if(item.fields.reference)
        bodyObj.shorttext.push({'sysid': item.sys.id,'title': item.fields.title, list : getFields(item.fields.reference)});
      else
				bodyObj.shorttext.push({'sysid': item.sys.id, list : []});
    }
    if (item.sys.contentType.sys.id === 'searchPanel' && bodyIds.indexOf(item.sys.id) >= 0){
      if(item.fields.dropDownRefrences)
        item.fields.dropDownRefrences.map(function(dropdown){
          if(shortList[dropdown.sys.id])
            bodyObj.searchPanel[shortList[dropdown.sys.id].title] = getFields(shortList[dropdown.sys.id].reference);
        });
			
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
}

var extractBanner = function extractBanner(banner, includes) {
  var imagetype = [];
  var imageids = banner.fields.sliderImage.map(function (item, index) {
    return item.sys.id;
  });

  includes.Entry.map(function(item){
    if(item.sys.contentType.sys.id === 'imagetype')
				{   let imageObj = Object.assign({sysid:item.sys.id},item.fields);
					//delete imageObj.imagePath;

      if (assets[imageObj.imagePath.sys.id]) imageObj.imagePath = assets[imageObj.imagePath.sys.id];
      imagetype[imageids.indexOf(item.sys.id)] = imageObj;
      let button = [];
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

const getFields = function (reference){
  return reference.map(function(item){
    if(shortList[item.sys.id])
      return shortList[item.sys.id];
  });
}
const extractColumns = function(columns , includes){
  let col = {}

  if(columns.fields.contentleft)
    col.contentleft = getBody('contentleft',columns,includes);
  if(columns.fields.contentRight)
    col.contentRight = getBody('contentRight',columns,includes);

  return col;
}



const getFooter = function(footer , includes){
  var footerObj = {
    footerLinks : []
  };	

  if(footer.fields.identifier && footer.fields.identifier === 'Footer')
	{	
    footerObj.footerContent =  footer.fields.description;

    const footerIds = footer.fields.footerlinks.map(function(item){
      if(hyperlinks[item.sys.id])
        footerObj.footerLinks.push(hyperlinks[item.sys.id]);
      return item.sys.id;
    });

		// includes.Entry.map(function(item){
		// 	if(item.sys.contentType.sys.id === 'hyperlink')
		// 		footerObj.footerLinks[footerIds.indexOf(item.sys.id)] = item.fields.hyperlinkText;
		// });

  }
  return footerObj;
}

const getCourseValues = function(item , includes) {
  let obj = {
    sysid: item.sys.id,
    couserMainBannerImage : "",
    courseModules : [],
    courseEvaluators : []
    // downloadPdf : []
  };

  let cBannerId = item.fields.couserMainBannerImage ? item.fields.couserMainBannerImage.sys.id: "";
  obj.couserMainBannerImage = assets[cBannerId] ? assets[cBannerId] : "";

  if(item.fields['courseEvaluators'])
    item.fields['courseEvaluators'].forEach(function(item){
      if(questions[item.sys.id]){
        obj.courseEvaluators.push({sysid:item.sys.id,fields:questions[item.sys.id]});
      }
    });
  if(item.fields['courseModules'])
    item.fields['courseModules'].forEach(function (item) {
      if (courseModules[item.sys.id]) {
        let thumbnail = courseModules[item.sys.id].thumbnailImage ? courseModules[item.sys.id].thumbnailImage.sys.id : "";
        let download = courseModules[item.sys.id].asset ? courseModules[item.sys.id].asset.sys.id : "";
        let tempContent = Object.assign({},courseModules[item.sys.id]);
        Object.assign(tempContent,{
          thumbnailImage: assets[thumbnail] ? assets[thumbnail] : "",
          asset: assets[download] ? assets[download] : "",
        });
        obj.courseModules.push({ sysid: item.sys.id, fields: tempContent });
      }
    });

  // if(item.fields['downloadPdf'])
  //   item.fields['downloadPdf'].forEach(function(pdf){
  //     if(downloadPdf[pdf.sys.id]){
  //       obj.downloadPdf.push(downloadPdf[pdf.sys.id]);
  //     }
  //   });

  return obj;
}

var getSubContents = function getSubContents(data) {
  let obj = {};
  data.items.forEach(function(it){
    if(it.sys.contentType.sys.id === 'materialUpload')
		{	let fileId = it.fields.fileAssetUpload.sys.id;
      obj = Object.assign({},it.fields);
      obj.sysid = it.sys.id;
      obj.fileAssetUpload = assets[fileId]?assets[fileId]:"";
      return obj;
    }
    if(it.sys.contentType.sys.id === 'contentTextOnly'){
      obj = Object.assign({},it.fields);
      obj.sysid = it.sys.id;
      return obj;
    }
    if(it.sys.contentType.sys.id === 'contentTextImage'){
			 let imageId = it.fields.image.sys.id;
			 obj = Object.assign({},it.fields);
			 obj.sysid = it.sys.id;
			 obj.image = assets[imageId]?assets[imageId]:"";
      return obj;
    }
    if(it.sys.contentType.sys.id === 'courseBox'){
      let tempObj = Object.assign({}, it.fields);
      obj = Object.assign(tempObj, getCourseValues(it,""));
    }
  });
  return obj;
}