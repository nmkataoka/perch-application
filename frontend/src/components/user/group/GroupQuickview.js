import React, {Component} from 'react';
import ExpanderIcons from '../../utilities/ExpanderIcons'
import './GroupQuickview.css'

class GroupQuickview extends Component {

	expandDescription() {
        document.getElementById('group-page-description').classList.toggle('expand')
    }

	render() {
		return(
			<div id='group-page-quickview'>
				<img src='https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/NGTYhyRhgilq4uu1a/videoblocks-doodle-cartoon-animation-of-science-chemistry-physics-astronomy-and-biology-school-education-subject-used-for-presenation-title-in-4k-ultra-hd_sl2xqduzw_thumbnail-full12.png' id='group-page-coverimage' />
				<div id='group-page-name'>{this.props.title}</div>
				<div id='group-page-description'>{this.props.description}</div>
				<ExpanderIcons id='group-page' action={this.expandDescription.bind(this)}/>
			</div>		
		)
	}
}

export default GroupQuickview;