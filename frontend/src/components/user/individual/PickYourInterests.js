import React, {Component} from 'react';
import { parse } from 'query-string';
import BasicButton from '../../utilities/buttons/BasicButton';
import BubbleChoice	from '../../utilities/BubbleChoice';
import Bubble from '../../utilities/Bubble';
import {EditContainerOnboarding} from './StudentEditors';
import {getStudent, getStudentTags, getCurrentStudentId, getStudentSkills, getLab, addSkillsToLab, syncTagsToStudent, syncSkillsToStudent, addTagsToLab, addSkillsToStudent, addTagsToStudent, getAllSkills, getAllTags, getCurrentUserId, getCurrentLabId, getStudentFromUser, isStudent, isLab, syncSkillsToLab, syncTagsToLab} from '../../../helper.js';
import './PickYourInterests.css';

class PickYourInterests extends Component {
	constructor(props) {
		super(props);
		var url_arr = this.props.location ? this.props.location.pathname.split('/') : "";
		this.state = {
			url_arr,
			dest: '',
			student_id: 1,
			lab_id: 1,
			btn_msg: 'next',
			display_info: {
				placeholder_txt: '',
				header_txt: '',
				catalog: [],
				interests: [],
				user_id: 1,
			},
			user_id: getCurrentUserId(),
			bubble_array: [],
			s_id: getCurrentStudentId(),
			l_id: getCurrentLabId(),
			interests: props.user && props.user.interests ? props.user.interests : [],
			skills: props.user && props.user.skills ? props.user.skills : [],
		};

		this.updateBubbleChoice = this.updateBubbleChoice.bind(this);
		this.saveAndContinue = this.saveAndContinue.bind(this);
	}

	getInterests() {
		// not good rn
		// getStudentTags(this.state.s_id).then(r => this.setState({display_info: {interests: r}}))
	}

	getSkills() {
		// getStudentSkills(this.state.s_id).then(r => this.setState({display_info: {interests: r}}))
	}

	componentDidMount() {
		var header_txt, placeholder_txt, dest = "";
		var url_arr = this.state.url_arr;
		var isLab = false; // isLab();
		var isStudent = true; //isStudent();

		if (url_arr[1] === "update-interests" || url_arr[1] === "pick-your-interests") {
			if (isLab) {
	         this.setState({
						display_info: Object.assign({}, this.state.display_info, {
				    header_txt: "Your Lab Labels",
				  	placeholder_txt: "descriptors for your lab work",
				  	user_type: 'faculty',
				  	req_type: 'tags',
				  	user_id: getCurrentLabId(),
					}),
				});
			}
			else if (isStudent) {
			    this.setState({
						display_info: Object.assign({}, this.state.display_info, {
		      	header_txt: "Your Interests",
		      	placeholder_txt: "field of interest",
		      	user_type: 'student',
		      	req_type: 'tags',
		      	user_id: getCurrentUserId(),
					}),
				});
			}
		}
		else if (url_arr[1] === "update-skills" || url_arr[1] === "lab-skills") {
			if (isLab) {
        this.setState({
						display_info: Object.assign({}, this.state.display_info, {
		      	header_txt: "Necessary Lab Skills",
						placeholder_txt: "Skills used to work in your lab",
						user_type: 'faculty',
						req_type: 'skills',
						user_id: getCurrentLabId(),
					}),
        });
			}
			else if (isStudent) {
          this.setState({
						display_info: Object.assign({}, this.state.display_info, {
		      	header_txt: "Your Lab Skills",
						placeholder_txt: "Skills you are competent in",
						user_type: 'student',
						req_type: 'skills',
						user_id: getCurrentUserId(),
					}),
        });
			}
		}

		if (url_arr[1] === "update-interests" || url_arr[1] === "update-skills") {
			this.setState({btn_msg: 'save'});
			if (isLab) {
				this.setState({dest: `/prof-page/${getCurrentLabId()}`});
			} else if (isStudent) {
				this.setState({dest: `/student-profile/${getCurrentUserId()}`});
			}
		} else {
			if (isLab) {
				this.setState({dest: `/prof-page/${getCurrentLabId()}`}); // UPDATE FOR FACULTY FLOW
			} else if (isStudent) {
				this.setState({dest: '/notable-classes'});
			}
		}
		if (url_arr[1] === "pick-your-interests") {
			this.setState({dest: '/lab-skills'});
		}
	}

	redirect() {
		window.location = this.state.dest;
	}

	saveAndContinue(event) {
		console.log("tag/skill array to add:");
		console.log(this.state.bubble_array);
		var item_ids = this.state.bubble_array.map((item) => {
			return item.id;
		});
		console.log(item_ids);
		if (isLab()) {
			if (this.state.display_info.req_type === 'skills') {
				syncSkillsToLab(this.state.l_id, item_ids).then(resp => {
					console.log(resp);
					this.redirect()
				});
			} else {
				syncTagsToLab(this.state.l_id, item_ids).then(resp => {
					console.log(resp);
					this.redirect()
				});
			}
		} else if (isStudent()) {
			if (this.state.display_info.req_type === 'skills') {
				// alert('skillz')
				syncSkillsToStudent(this.state.s_id, item_ids).then(resp => {
					console.log(resp);
					this.redirect()
				});
			} else {
				// alert('interestz')
				// alert(this.state.display_info.req_type)
				syncTagsToStudent(this.state.s_id, item_ids).then(resp => {
					console.log(resp);
					this.redirect()
					// getStudentTags(this.state.s_id).then(r=>console.log(r))
				});
			}
		}
	}

	updateBubbleChoice(choices, skills) {
	  this.setState({ bubble_array: choices });
		if (this.props.updateUser) {
			var type = skills ? "skills" : "interests";
			this.props.updateUser(type, choices);
		}
	}

	render() {
		// temp while waiting for backend updates
		var skillsDisplayInfo = {
			placeholder_txt: 'search skills',
			header_txt: 'your skills',
			interests: this.state.skills,
		}
		var interestsDisplayInfo = {
			placeholder_txt: 'search interests',
			header_txt: 'your interests',
			interests: this.state.interests,
		}

		var bubblePickers =
			<div>
				<BubbleChoice ref='bubble_choice' skills={true} display_info={skillsDisplayInfo} callbackSkills={this.updateBubbleChoice}/>
				<BubbleChoice ref='bubble_choice' skills={false} display_info={interestsDisplayInfo} callbackSkills={this.updateBubbleChoice}/>
			</div>

		if (this.props.editorOnly) {
			return (bubblePickers)
		}

		return(
			<EditContainerOnboarding title="Skills and Interests" redirect={this.redirect.bind(this)}>
				<form className="skills-interests-form">
					{bubblePickers}
				</form>
			</EditContainerOnboarding>
		);
	}
}

export default PickYourInterests;
