import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppComponent from './app.component';
import IndexComponent from './components/index/index.component';
import PostLoginBody from './components/shared/header/postLoginBody.component';
import CourseComponent from "./components/course/course.component";
import CalendarioComponent from "./components/calendario/calendario.component";
import ToolsComponent from "./components/clinicalTools/tools.component";
import MyProfile from "./components/myprofile/myprofile.component";
import TermsConditions from "./components/terms-and-conditions/terms.component";
import AboutUs from "./components/about-us/aboutus.component";
import RegisterComponent from './components/register/register.component';
import CourseDetailsComponent from "./components/course/course-details/course.details.component";
import requireAuth from "./utils/require-auth";
import ContactUs from "./components/contact-us/contactus.component";
import Questions from "./components/faq/faq.component";
import CourseCertificate from "./components/course/course-details/course.certificate";
import WebmapComponent from "./components/web-map/webmap.component";
import Error404 from "./components/errors/404";
import ResetPassword from './components/forgot-password/reset-password';
import CongratsComponent from "./components/register/congrats.component";

export default (
	<Route path="/" component={AppComponent}>
		<IndexRoute component={IndexComponent}/>
		<Route path="home" component={PostLoginBody} onEnter={requireAuth} />
		<Route path="cursos" component={CourseComponent} onEnter={requireAuth} />
		<Route path="calendario" component={CalendarioComponent} onEnter={requireAuth} />
		<Route path="herramientas" component={ToolsComponent} onEnter={requireAuth} />
		<Route path="myprofile" component={MyProfile} onEnter={requireAuth} />
		<Route path="privacy" component={TermsConditions} onEnter={requireAuth} />
		<Route path="about" component={AboutUs} onEnter={requireAuth} />
		<Route path="register" component={IndexComponent}>
            <IndexRoute component={RegisterComponent}/>
        </Route>
        <Route path="reset-password" component={IndexComponent}>
            <IndexRoute component={ResetPassword}/>
        </Route>
        <Route path="verify-email" component={IndexComponent}>
            <IndexRoute component={CongratsComponent}/>
        </Route>
		<Route path="coursedetail" component={CourseDetailsComponent} onEnter={requireAuth} />
		<Route path="contact" component={ContactUs} onEnter={requireAuth} />
		<Route path="faq" component={Questions} onEnter={requireAuth} />
		<Route path="acreditacion" component={CourseCertificate} onEnter={requireAuth} />
		<Route path="webMap" component={WebmapComponent} onEnter={requireAuth} />
		<Route path="*" component={Error404}/>
	</Route>
)