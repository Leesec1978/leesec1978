"use strict";(self.webpackChunk_stlite_desktop=self.webpackChunk_stlite_desktop||[]).push([[1261],{71261:(e,t,i)=>{i.r(t),i.d(t,{default:()=>d});var s=i(5057),o=i(52955),r=i(17943),l=i(50120),a=i(96266);class n extends s.PureComponent{constructor(){super(...arguments),this.formClearHelper=new o.K,this.state={value:this.initialValue},this.commitWidgetValue=e=>{const{widgetMgr:t,element:i,fragmentId:s}=this.props;t.setStringValue(i,this.state.value,e,s)},this.onFormCleared=()=>{this.setState(((e,t)=>({value:t.element.default})),(()=>this.commitWidgetValue({fromUi:!0})))},this.onColorClose=e=>{this.setState({value:e},(()=>this.commitWidgetValue({fromUi:!0})))}}get initialValue(){const e=this.props.widgetMgr.getStringValue(this.props.element);return void 0!==e?e:this.props.element.default}componentDidMount(){this.props.element.setValue?this.updateFromProtobuf():this.commitWidgetValue({fromUi:!1})}componentDidUpdate(){this.maybeUpdateFromProtobuf()}componentWillUnmount(){this.formClearHelper.disconnect()}maybeUpdateFromProtobuf(){const{setValue:e}=this.props.element;e&&this.updateFromProtobuf()}updateFromProtobuf(){const{value:e}=this.props.element;this.props.element.setValue=!1,this.setState({value:e},(()=>{this.commitWidgetValue({fromUi:!1})}))}render(){var e;const{element:t,width:i,disabled:s,widgetMgr:o}=this.props,{value:n}=this.state;return this.formClearHelper.manageFormClearListener(o,t.formId,this.onFormCleared),(0,a.jsx)(r.Z,{label:t.label,labelVisibility:(0,l.iF)(null===(e=t.labelVisibility)||void 0===e?void 0:e.value),help:t.help,onChange:this.onColorClose,disabled:s,width:i,value:n})}}const d=n},52955:(e,t,i)=>{i.d(t,{K:()=>o});var s=i(50120);class o{constructor(){this.formClearListener=void 0,this.lastWidgetMgr=void 0,this.lastFormId=void 0}manageFormClearListener(e,t,i){null!=this.formClearListener&&this.lastWidgetMgr===e&&this.lastFormId===t||(this.disconnect(),(0,s.bM)(t)&&(this.formClearListener=e.addFormClearedListener(t,i),this.lastWidgetMgr=e,this.lastFormId=t))}disconnect(){var e;null===(e=this.formClearListener)||void 0===e||e.disconnect(),this.formClearListener=void 0,this.lastWidgetMgr=void 0,this.lastFormId=void 0}}}}]);