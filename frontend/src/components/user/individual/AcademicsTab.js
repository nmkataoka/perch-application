import React, {Component} from 'react';
import {getCurrentUserId} from '../../../helper.js'
import './AcademicsTab.css';

class AcademicsTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: window.location.pathname.split( '/' )[2],
		}
	}

	render() {
		return (
			<div id='academic-tab-header' className='tab-container-L'>
				<h1>school
					<a href='/update-notable-classes' id="editImageText" className="null-link-style" >
					{ getCurrentUserId() === this.state.id && 
						<i id='academics-editor' className="material-icons edit-icon" >create</i>
					}
					</a>
				</h1> 
				<div className='academics-tab left-align'>
					<div>
						<span className='academic-label'>GPA: </span>
						<span className='academic-info'>{this.props.gpa}</span>
					</div>
					<div>
						<span className='academic-label'>Year: </span>
						<span className='academic-info'>{this.props.year}</span>
					</div>
					<div>
						<span className='academic-label'>Major: </span>
						<span className='academic-info'>{this.props.major}</span>
					</div>
					<div className='classes-wrapper'>
						<span className='academic-label'>Notable Classes: </span>
						<span className='academic-info'>
							{this.props.classes.map((c)=>{
								return ( <div key={c}>{c}<br/></div>)
							})}
							<br/>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default AcademicsTab;