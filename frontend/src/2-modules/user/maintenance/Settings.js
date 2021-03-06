// Text gathering component for both lab-name and lab-description pages
import React, {Component} from 'react';
import BasicButton from '../../utilities/buttons/BasicButton';
import ResetEmailModal from '../../utilities/modals/ResetEmailModal';
import ResetPasswordModal from '../../utilities/modals/ResetPasswordModal';
import DeleteUserModal from '../../utilities/modals/DeleteUserModal';
import DotLoader from '../../utilities/animations/DotLoader';
import {getStudent, isLoggedIn, getCurrentUserId, verifyLogin, getUser, updateStudent, getStudentFromUser, updateUser, isStudent, isLab} from '../../../helper.js'
import './Settings.css';
import $ from 'jquery';
import alertify from 'alertify.js';
import iziToast from 'izitoast';

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			user_type: "",
			loading: true,
		};
		this.openEmailModal = this.openEmailModal.bind(this);
		this.openPasswordModal = this.openPasswordModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.resetEmail = this.resetEmail.bind(this);
	}

	componentDidMount() {
		if (isLoggedIn()) {
			getUser(getCurrentUserId()).then((resp) => {
				console.log(resp);
				this.setState(
					{
						name: resp.data.name,
						email: resp.data.email,
						user_type: resp.data.is_student ? "Student" : "Faculty",
						loading: false,
					}
				);
				if (resp.data.is_student) {
					getStudentFromUser(getCurrentUserId()).then( r => {
						this.setState({student_id: r.data.id})
					});
				}
			});
		}
	}

	resetEmail(email) {
		updateUser(getCurrentUserId(), null, email, $('#new_password').val(), isStudent(), isLab()).then(resp => {
			// alertify.success("Email Successfully Reset");
			iziToast.show({
				    title: 'Success',
				    message: 'Email Reset',
				    color: 'green',
				    position: 'bottomLeft',
				    progressBarColor: 'white',
				});
			console.log(resp);
			this.setState({ email: email });
		});
		// updateStudent(this.state.student_id, null, null, null, null, null, email, null, null, null).then(resp => {
		// 	alertify.success("Email Successfully Reset");
		// 	console.log(resp);
		// 	this.setState({ email: email });
		// });
	}

	openEmailModal() { // superClick
		$("#resetEmail").addClass('activated');
    $("#modalBackdrop").fadeIn("slow");
	}

	openPasswordModal() { // superClick
		$("#resetPassword").addClass('activated');
    $("#modalBackdrop").fadeIn("slow");
	}

	openDeleteModal() { // superClick
		$("#deleteUser").addClass('activated');
    $("#modalBackdrop").fadeIn("slow");
	}

	render() {
		return (
			<div>
				<ResetEmailModal callbackEmail={this.resetEmail} />
				<ResetPasswordModal email={this.state.email}/>
				<DeleteUserModal />
				<div id="modalBackdrop"></div>
				<div className='lab-text-info shift-down'>
					<div className='container center-align lab-text-info-form shadow'>
						<div className='lab-text-info-header'>Settings</div>
						<div className='row'>
							<div className='container col m4 s4 l4 setting-col'>
								<i className="material-icons setting-icon">mail outline</i>
								<BasicButton icon='mail outline' superClick={this.openEmailModal} msg='reset email'/>
							</div>
							<div className='container col m4 s4 l4 setting-col'>
								<i className="material-icons setting-icon">lock outline</i>
								<BasicButton icon='lock outline' superClick={this.openPasswordModal} msg='reset password'/>
							</div>
							<div className='container col m4 s4 l4 setting-col'>
								<i className="material-icons setting-icon">remove circle</i>
								<BasicButton icon='remove circle' superClick={this.openDeleteModal} msg='delete account'/>
							</div>
						</div>
						<div className='container user-information'>
							<b>Current User Information</b> <br/>
							{this.state.loading ?
								<DotLoader />
								:
								<div>
									Name: {this.state.name} <br/>
									Email: {this.state.email} <br/>
									User Type: {this.state.user_type} <br/>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Settings;
