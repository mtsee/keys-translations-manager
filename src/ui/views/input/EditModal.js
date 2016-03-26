import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import FormPanel from './FormPanel'
import AlertPanel from '../input/AlertPanel'
//import ErrorActions from '../../actions/ErrorActions'
//import ErrorStore from '../../stores/ErrorStore'
//import TranslationActions from '../../actions/TranslationActions'
import localeUtil from 'keys-translations-manager-core/lib/localeUtil'

export default class EditModal extends React.Component {
	static propTypes = {
		data: React.PropTypes.object.isRequired,
		errors: React.PropTypes.array.isRequired,
		updateTranslation: React.PropTypes.func.isRequired,
		alertErrors: React.PropTypes.func.isRequired,
		clearErrors: React.PropTypes.func.isRequired
	};
	static contextTypes = {
		config: React.PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			showModal: false
		};
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	/*componentDidMount() {
		this.unsubscribe = ErrorStore.listen(this.onErrorChange.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}*/

	updateTranslation() {
		const config = this.context.config,
			el = this.refs.formPanel.getFormElements(),
			projects = el["project[]"],
			lenProjects = projects.length,
			locales = config.locales,
			lenLocales = locales.length;
		let i, v, locale,
			project = [],
			emptyFields = [],
			data = this.props.data;

		for (i = 0; i < lenLocales; i++) {
			locale = locales[i]
			v = el[locale].value.trim()
			if (v) {
				data[locale] = v
			} else {
				emptyFields.push(localeUtil.getMsg("ui.common.locale") + " / " + locale)
			}
		}

		for (i = 0; i < lenProjects; i++) {
			if (projects[i].checked) {
				project.push(projects[i].value);
			}
		}
		if ( project.length > 0 ) {
			data.project = project
		} else {
			emptyFields.push(localeUtil.getMsg("ui.common.applyto"))
		}

		if ( emptyFields.length > 0 ) {
			/*ErrorActions.alert([{
				type: 'emptyfield',
				action: "u",
				params: data,
				match: emptyFields
			}]);*/
			this.props.alertErrors([{
				type: 'emptyfield',
				action: "u",
				params: data,
				match: emptyFields
			}]);
		} else {
			//ErrorActions.clear();
			this.props.updateTranslation(data);
		}
	}

	/*onErrorChange(errors) {
		this.setState({
			errors: errors
		});
	}*/

	close() {
		this.setState({
			showModal: false//,
			//errors: []
		});
	}

	open() {
		this.setState({
			showModal: true//,
			//errors: []
		});
	}

	render() {
		const { data, errors, clearErrors } = this.props;
		console.log("this.props.errors-editpanel", this.props.errors);
		return (
			<Modal show={this.state.showModal} onHide={this.close.bind(this)}>
				<Modal.Header>
					<Modal.Title>
						{localeUtil.getMsg("ui.common.edit")}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AlertPanel errors={errors} clearErrors={clearErrors} action="u"/>
					<FormPanel ref="formPanel" action="u" data={data}/>
				</Modal.Body>
				<Modal.Footer>
					<Button bsSize="small" bsStyle="primary" onClick={this.updateTranslation.bind(this)}>
						{localeUtil.getMsg("ui.common.update")}
					</Button>
					<Button bsSize="small" onClick={this.close.bind(this)}>
						{localeUtil.getMsg("ui.common.cancel")}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
