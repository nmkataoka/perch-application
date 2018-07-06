import React, {Component} from 'react';
import {permissionCheck, getLab, isLoggedIn, getCurrentUserId, getUser, getFacultyFromUser, getAllLabPositions, getLabPositions, getLabPreferences, isStudent, isLab} from '../../../helper.js'
import ErrorPage from '../../utilities/ErrorPage'
import ExtLinkBox from '../ExtLinkBox'
import ExpanderIcons from '../../utilities/ExpanderIcons'
import './ProfPage.css'

class ProfPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lab_name: "",
			yes: ['spots open', 'undergrads', 'credit'],
			no: ['paid', 'seniors', 'freshmen'],
			img_src: 'https://static1.squarespace.com/static/54693b1ee4b07c8a3da7b6d0/58df54aa1b10e31ed44dab4b/58df54ab6b8f5b410f59d285/1491031900534/Leap-Systems-2016-Headshots-By-Lamonte-G-Photography-IMG_1871-Edit.jpg',
			labels: [], 
			skills: [], 
			positions: [],
			contact_info: [],
			user_id: getCurrentUserId(),
			no_lab: false,
			dest: '/edit-external-links',
		};
	}

	componentDidMount() {
		console.log(getCurrentUserId());
		if (isLoggedIn()) {
			// check if user or faculty for viewing positions
			if (isStudent())
				this.setState({user_type: "user"});
			else if (isLab())
				this.setState({user_type: "faculty"});
	
			var lab_id = window.location.pathname.split('/')[2];
			getLab(lab_id).then((resp) => {
				console.log(resp);
				if (resp.data) {
					getAllLabPositions(lab_id).then(positions => {
						console.log(positions);
						this.setState({ positions: positions });
					});
					getLabPreferences(lab_id).then(prefs => {
						console.log(prefs);
						var no_arr = [];
						var yes_arr = [];
						if (prefs) {
							for (var i = 0; i < prefs.length; ++i) {
								if (prefs[i].type === "No") {
									no_arr.push(prefs[i]);
								} else {
									yes_arr.push(prefs[i]);
								}
							}
						}
						// this.setState({ yes: yes_arr, no: no_arr });
					});
					var contact_info = [];
					if (resp.data.location) {
						contact_info.push({label: 'location', value: resp.data.location});
					} 
					if (resp.data.contact_email) {
						contact_info.push({label: 'email', value: resp.data.contact_email});
					}
					this.setState(
						{
							lab_name: resp.data.name,
							contact_info: contact_info,
							lab_summary: resp.data.description,
							labels: resp.tags,
							skills: resp.skills,
							//img_src: resp.data.labpic_path, ADD BACK IN TO SHOW IMAGE ONCE ON SAME SERVER!
						}
					);
				} else {
					this.setState({ no_lab: true });
				}
	        });
		}
	}

	render() {
		var apply_dest = '/apply/' + window.location.pathname.split('/')[2];
		// TODO TEMPORARILY COMMENTED OUT UNTIL INTEGRATED WITH BACKEND
		// if (!isLoggedIn()) {
		// 	return <ErrorPage /> 
		// } else if (this.state.no_lab) {
		// 	return <ErrorPage fourofour="true" />
		// } else {
			return (
				<div id='user-content-body'>
		 			<div id='user-column-L'>
		 				<div>
		 					<h1><i className='em em-brain'/></h1>
		 					<div>
		 						Extraordinary Alchemist
		 					</div>
		 				</div>
		 				<div>
		 					<h1><i class="em em-telephone_receiver"></i></h1>
		 					<div>
		 						<div id='user-email'><b>Email</b> <a href={`mailto:${'bearb@umich.edu'}`}>bcoppola@umich.edu</a></div>
		 						<div><b>Phone</b> 815 262 6642</div>
		 					</div>
		 				</div>
		 				<div id='user-links'>
		 					<h1><i className='em em-link'/></h1>
		 					<div>
		 						<a>LinkedIn</a>
		 						<a>Website</a>
		 						<a>Lab Resources</a>
		 					</div>
		 				</div>
		 			</div>
		 			<div id='user-column-R'>
		 				<div className='ad'></div>
		 				<div className='ad'></div>
		 				<div className='ad'></div>
		 			</div>
		 			<div id='user-profile-column-C'>
		 				<div id='user-quickview'>
		 					<img id='user-quickview-img' src='/img/headshots/bcoppola.jpg'/>
		 					<img id='user-quickview-coverimage' src='https://previews.123rf.com/images/balabolka/balabolka1609/balabolka160900265/62527939-cartoon-cute-hand-drawn-science-seamless-pattern-colorful-detailed-with-lots-of-objects-background-e.jpg' />
		 					<div id='user-quickview-footer'>University of Michigan</div>
		 					<div id='user-quickview-name'>Dr. Brian Coppola</div>
		 				</div>
		 				<div>
		 					<h1>Work Experience</h1>
		 					<UserWorkExperience title="Manhattan Project" description="Did some pretty cool stuff, including but not limited to: sleeping in the acetone bath, juggling vials, playing russian hydrochloric acid roulette, spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room." startTime='August 2017' endTime='Present'/>
		 					<UserWorkExperience title="CVS" description="Did some pretty cool stuff, including but not limited to: sleeping in the acetone bath, juggling vials, playing russian hydrochloric acid roulette, spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room." startTime='June 2015' endTime='September 2016'/>
		 				</div>
		 				<div id='user-education'>
		 					<h1>Education</h1>
		 				</div>
		 			</div>
	 			</div>
			)
		// }
	}
}


class UserClasses extends Component {
	expand() {
		let elem = document.getElementById('user-classes-expander')
		elem.innerHTML = elem.innerHTML === 'expand_more' ? 'expand_less' : 'expand_more'
		document.getElementById('user-classes').classList.toggle('active-blue')
		document.getElementById('user-classes-list').classList.toggle('expand');

	}

	render() {
		return(
			<div id='user-classes' >
				<span onClick={this.expand.bind(this)}>
					Notable Classes 
					<i className="material-icons" id='user-classes-expander'>expand_more</i>
				</span>
				<div id='user-classes-list'>
					{this.props.list.map(item => <div>{item}</div>)}
				</div>
			</div>
		)
	}
}

class UserWorkExperience extends Component {
	expand() {
		document.getElementById(`user-work-description-${this.props.title}`).classList.toggle('expand')
	}

	render() {
		return(
			<div id={`user-work-${this.props.title}`} className='user-work-experience'>
				<div className='user-work-title'>{this.props.title}</div>
				<div className='user-work-time'>
					{`${this.props.startTime} - ${this.props.endTime}`}
				</div>
				<div id={`user-work-description-${this.props.title}`} className='user-work-description'>{this.props.description}</div>
				<ExpanderIcons id={`user-work-${this.props.title}`} action={this.expand.bind(this)}/>
			</div>
		)
	}
}

export default ProfPage;