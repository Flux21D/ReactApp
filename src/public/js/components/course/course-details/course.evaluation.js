import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { cursosEvaluationResult } from "../../../actions/cursos.evaluation";
import {replaceSVGIcons} from "../../../utils/custom.jquery";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class CourseEvaluation extends React.Component {
    constructor(props) {
        super(props);
        this.tempObj = {};

        this.evaluateCourse = this.evaluateCourse.bind(this);
        this.checkBoxHandler = this.checkBoxHandler.bind(this);
        this.evaluateBtnHandler = this.evaluateBtnHandler.bind(this);
        this.certificateBtnHandler = this.certificateBtnHandler.bind(this);
    }

    state = {
        isEvaluate: false
    };

    componentDidMount () {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        let questionsObj = this.props.courseInfo.courseEvaluators;
        for (let i = 1; i <= questionsObj.length; i++) {
            this.tempObj[i] = {correctAns: questionsObj[i-1].fields.correctAnswer, resp: ''};
            let a = document.getElementById(i+'.A');
            a ? a.addEventListener('click', this.checkBoxHandler.bind(this)) : '';
            let b = document.getElementById(i+'.B');
            b ? b.addEventListener('click', this.checkBoxHandler.bind(this)) : '';
            let c = document.getElementById(i+'.C');
            c ? c.addEventListener('click', this.checkBoxHandler.bind(this)) : '';
            let d = document.getElementById(i+'.D');
            d ? d.addEventListener('click', this.checkBoxHandler.bind(this)) : '';
        };

        if(this.state.isEvaluate) {
            replaceSVGIcons();
        }
    };

    checkBoxHandler(eve) {
        let option = eve.target.id.split('.');
        let evalObject = this.tempObj[option[0]];
        if(eve.target.checked) {
            evalObject.resp = option[1];
        }
        eve.stopImmediatePropagation();
    }

    evaluateBtnHandler(evaluate) {
        this.setState({isEvaluate: evaluate});
    }

    evaluateCourse(percentage) {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let status = percentage < 70 ? 'fail' : 'pass';
        let courseId = this.props.courseInfo.sysid;
        let credits = this.props.courseInfo.credits ? this.props.courseInfo.credits.split(' ') : '';
        this.props.cursosEvaluationResult(userInfo.user.uuid, courseId, percentage, status, credits[0], 'yes');
    }

    certificateBtnHandler() {
        this.props.courseInfo.sourcePath = 'course';
        this.props.courseInfo.courseCompletionDate = new Date().toLocaleDateString();
        this.context.router.push({ 
            pathname: '/acreditacion',
            state: this.props.courseInfo
        });
    }

    render() {
        const {courseInfo} = this.props;
        let question = '';
        let that = this;
        let totalQuestions = courseInfo.courseEvaluators.length;
        let totlMarksObtained = 0, percentageObtained = 0;
        courseInfo.courseEvaluators.map(function(item, index) {
            let evalInfo = item.fields;
            let quesNo = index + 1;
            if(that.state.isEvaluate) {
                let evalObj = that.tempObj[quesNo];
                (evalObj.resp === evalInfo.correctAnswer) ? ++totlMarksObtained : '';
                let quesClass = (evalObj.resp !== evalInfo.correctAnswer) ? 'question question-ko' : 'question question-ok';
                let optAclass = evalInfo.correctAnswer === 'A' ? ['option option-ok', 'svg svgV', 'check-circle.svg'] : ((evalObj.resp !== 'A') ? ['option', 'svg svgG', 'circle.svg'] : ['option option-ko', 'svg svgR', 'times-circle.svg']);
                let optBclass = evalInfo.correctAnswer === 'B' ? ['option option-ok', 'svg svgV', 'check-circle.svg'] : ((evalObj.resp !== 'B') ? ['option', 'svg svgG', 'circle.svg'] : ['option option-ko', 'svg svgR', 'times-circle.svg']);
                let optCclass = evalInfo.correctAnswer === 'C' ? ['option option-ok', 'svg svgV', 'check-circle.svg'] : ((evalObj.resp !== 'C') ? ['option', 'svg svgG', 'circle.svg'] : ['option option-ko', 'svg svgR', 'times-circle.svg']);
                let optDclass = evalInfo.correctAnswer === 'D' ? ['option option-ok', 'svg svgV', 'check-circle.svg'] : ((evalObj.resp !== 'D') ? ['option', 'svg svgG', 'circle.svg'] : ['option option-ko', 'svg svgR', 'times-circle.svg']);
                question = question + '<div class="qa"><div class="' + quesClass  + '"><div class="num">' + quesNo + '</div><div class="text">' + evalInfo.question + '</div><div class="clear"></div></div><div class="answer"><div class="' + optAclass[0] + '"><div class="input"><span class="aw"><img class="' + optAclass[1] + '" src="img/icons/' + optAclass[2] + '" title="Icono"/></span></div><div class="text"><label>' + evalInfo.A + '</label></div><div class="clear"></div></div><div class="' + optBclass[0] + '"><div class="input"><span class="aw"><img class="' + optBclass[1] + '" src="img/icons/' + optBclass[2] + '" title="Icono"/></span></div><div class="text"><label>' + evalInfo.B + '</label></div><div class="clear"></div></div><div class="' + optCclass[0] + '"><div class="input"><span class="aw"><img class="' + optCclass[1] + '" src="img/icons/' + optCclass[2] + '" title="Icono"/></span></div><div class="text"><label>' + evalInfo.C + '</label></div><div class="clear"></div></div><div class="' + optDclass[0] + '"><div class="input"><span class="aw"><img class="' + optDclass[1] + '" src="img/icons/' + optDclass[2] + '" title="Icono"/></span></div><div class="text"><label>' + evalInfo.D + '</label></div><div class="clear"></div></div><div class="clear"></div></div></div>';

                if(quesNo === totalQuestions) {
                    percentageObtained = (totlMarksObtained / totalQuestions) * 100;
                    that.evaluateCourse(percentageObtained.toFixed(2));
                }
            } else {
                question = question + '<div class="qa"><div class="question"><div class="num">' + quesNo + '</div><div class="text">' + evalInfo.question + '</div><div class="clear"></div></div><div class="answer"><div class="option"><div class="input"><input type="radio" value="1" id="' + quesNo + '.A" name="' + quesNo + '" /></div><div class="text"><label htmlFor="' + quesNo + '.A">' + evalInfo.A + '</label></div><div class="clear"></div></div><div class="clear"></div><div class="option"><div class="input"><input type="radio" value="1" id="' + quesNo + '.B" name="' + quesNo + '" /></div><div class="text"><label htmlFor="' + quesNo + '.B">' + evalInfo.B + '</label></div><div class="clear"></div></div><div class="clear"></div><div class="option"><div class="input"><input type="radio" value="1" id="' + quesNo + '.C" name="' + quesNo + '" /></div><div class="text"><label htmlFor="' + quesNo + '.C">' + evalInfo.C + '</label></div><div class="clear"></div></div><div class="clear"></div><div class="option"><div class="input"><input type="radio" value="1" id="' + quesNo + '.D" name="' + quesNo + '" /></div><div class="text"><label htmlFor="' + quesNo + '.D">' + evalInfo.D + '</label></div><div class="clear"></div></div><div class="clear"></div><div class="clear"></div></div></div>';
            }
        });

        const questionElement = htmlToReactParser.parse(question);

        return (
            <div className="col-left">
                <div className="sub-page-evaluacion">
                    <h2 className="title-big nmt"><strong>Evaluación</strong></h2>
                    { 
                        !that.state.isEvaluate ? 
                        <p className="section-intro">Pellentesque velit lorem, accumsan commodo laoreet <strong>erat, fermentum euismod enim. Mauris cursus, ante quis gravida ultricies</strong>, lectus felis mollis nulla, quis interdum magna justo sed tortor. Donec pulvinar neque ac orci pretium eleifend.</p>
                        : null
                    }

                    {/*<!-- if the user passed the exam -->*/}
                    { 
                        that.state.isEvaluate && percentageObtained >= 70 ? 
                        <div className="resultado resultado-ok">
                            <div className="title">¡Has superado el examen con un <strong>{totlMarksObtained}/{totalQuestions}</strong>!</div>
                            <p className="txt">
                                Pellentesque velit lorem, accumsan commodo laoreet <strong>erat, fermentum euismod enim. Mauris cursus, ante quis gravida ultricies</strong>, lectus felis mollis nulla, quis interdum magna justo sed tortor
                                <br/><br/><Link title="Descargar acreditación" className="button tight" onClick={this.certificateBtnHandler}><span className="aw"><img className="svg svgW " src="img/icons/mortar-board.svg" title="Icono"/></span> Descargar acreditación</Link>
                            </p>
                        </div>
                        : null
                    }

                    {/*<!-- if the user didn't pass the exam -->*/}
                    { 
                        that.state.isEvaluate && percentageObtained < 70 ?  
                        <div className="resultado resultado-ko">
                            <div className="title"><strong>{totlMarksObtained}/{totalQuestions}</strong>: Lo sentimos, no has superado el examen</div>
                            <p className="txt">
                                Pellentesque velit lorem, accumsan commodo laoreet <strong>erat, fermentum euismod enim. Mauris cursus, ante quis gravida ultricies</strong>, lectus felis mollis nulla, quis interdum magna justo sed tortor
                                <br/><br/><Link title="Repetir evaluación" className="button tight" onClick={() => this.evaluateBtnHandler(false)}><span className="aw"><img className="svg svgW " src="img/icons/pencil.svg" title="Icono"/></span> Repetir evaluación</Link>
                            </p>
                        </div>
                        : null
                    } 

                    <div className="std-form form">
                        <form>
                            {questionElement}
                            {
                                !that.state.isEvaluate ? 
                                <div className="submit">
                                    <input className="submit" type="button" value="Enviar" onClick={() => this.evaluateBtnHandler(true)} />
                                </div>
                                : null
                            }
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const actionCreators = {
    cursosEvaluationResult
};

const mapStateToProps = (state) => {
    return {
        cursosEvaluation: state.cursosEvaluation,
        auth: state.auth
    };
};

CourseEvaluation.contextTypes = { 
  router: React.PropTypes.object.isRequired
} 


export default connect(mapStateToProps, actionCreators)(CourseEvaluation);