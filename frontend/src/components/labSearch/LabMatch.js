import React, {Component} from 'react';
import LabSearch from './LabSearch';
import LabSearch2 from './LabSearch2';
import LabList from './LabList';
import {getAllLabs, getLabTags, isLoggedIn} from '../../helper.js'
import ErrorPage from '../utilities/ErrorPage'

class LabMatch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			labs: [],
		}
	}

	render() {
		// Temporarily commented out for linking to others
		//if (isLoggedIn()) {
			return (
				<div className='shift-down'>
					<LabSearch2 />
				</div>
			);
		// Temporarily commented out for linking to others
		/*

		else {
			return <ErrorPage />
		}
		*/
	}
}

export default LabMatch;