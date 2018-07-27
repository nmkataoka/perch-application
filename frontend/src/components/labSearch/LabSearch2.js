import React, {Component} from 'react';
// import './LabSearch.css';
import './LabSearch2.css';
import ExpanderIcons from '../utilities/ExpanderIcons'
// import Bubble from '../utilities/Bubble';
// import LabList from './LabList';
import LabSearchItem from './LabSearchItem';

import '../user/individual/PickYourInterests.css';
import {getAllLabs, getLabTags, isLoggedIn, getCurrentUserId, getStudentFromUser, getAllSkills, getAllTags, getStudentSkills, getStudentTags, getUser, getSearchData, labSearch} from '../../helper.js'
import {getFilters} from '../../data/filterData';

const filterTypes = ['departments', 'researchAreas', 'minReqs', 'lab-skills'];
const filterFriendlyNames = ['Departments', 'Research Areas', 'Minimum Requirements', 'Lab Skills'];

class LabSearch extends Component {
	constructor(props) {
		super(props);
		this.handleFilterClick = this.handleFilterClick.bind(this);

		var filts = {};
		var parentFilts = {}
		filterTypes.map(type => {
			filts[type] = {};
			parentFilts[type] = [];
			// getFilters(type).map(filt => {
			// 	if (!filt.isSubFilt) {
			// 		parentFilts[type].push(filt);
			// 	}
			//   filts[type][filt.slug] = filt;
			// })
		})

		this.state = {
			filts,
			parentFilts,
            all_labs: [],
            areas: [],
            departments: [],
            commitments: [],
            skills: [],
			s_id: '',
            search: '',
		}
	}

    componentWillMount() {
        getAllLabs().then((resp) => {
            var newState = this.state;
            var all_labs = resp.data
            //console.log(resp);
            for (var key in all_labs) {
                let lab = all_labs[key].data;
                newState.all_labs.push(<LabSearchItem name={lab.name} dept='MISSING' rsrch='MISSING' img='/img/akira.jpg' description='NULL' positions={lab.positions}/>);
            }

            this.setState(newState);
        });

        getSearchData().then((resp) => {
            //console.log(resp);
            let new_filts = this.state.filts;
            let new_parentFilts = this.state.parentFilts;

            resp.data.all_commitments.map((req) => {
                new_filts['minReqs'][req] = {friendlyName: req, slug: req};
                new_parentFilts['minReqs'].push({friendlyName: req, slug: req});
            });

            resp.data.available_skills.map((skill) => {
                new_filts['lab-skills'][skill] = {friendlyName: skill, slug: skill};
                new_parentFilts['lab-skills'].push({friendlyName: skill, slug: skill});
            });

            resp.data.available_areas.map((area) => {
                new_filts['researchAreas'][area] = {friendlyName: area, slug: area};
                new_parentFilts['researchAreas'].push({friendlyName: area, slug: area});
            });

            resp.data.available_departments.map((dept) => {
                new_filts['departments'][dept] = {friendlyName: dept, slug: dept};
                new_parentFilts['departments'].push({friendlyName: dept, slug: dept});
            });

            this.setState({filts: new_filts, parentFilts: new_parentFilts});
            //console.log(this.state.filts);
            //console.log(this.state.parentFilts);
        });

    }

	expand(type) {
		document.getElementById(`${type}-filter`).classList.toggle('expand')
	}

	handleFilterClick(filterType, slug) {
		var newState = this.state;
		if (newState.filts[filterType][slug].clicked) {
			newState.filts[filterType][slug].clicked = false;

            switch(filterType) {
                case 'departments':
                    newState.departments.splice(newState.departments.indexOf(slug), 1);
                    break;
                case 'researchAreas':
                    newState.areas.splice(newState.areas.indexOf(slug), 1);
                    break;
                case 'minReqs':
                    newState.commitments.splice(newState.commitments.indexOf(slug), 1);
                    break;
                case 'lab-skills':
                    newState.skills.splice(newState.skills.indexOf(slug), 1);
                    break;
            }
		} else {
			newState.filts[filterType][slug].clicked = true;

            switch(filterType) {
                case 'departments':
                    newState.departments.push(slug);
                    break;
                case 'researchAreas':
                    newState.areas.push(slug);
                    break;
                case 'minReqs':
                    newState.commitments.push(slug);
                    break;
                case 'lab-skills':
                    newState.skills.push(slug);
                    break;
            }
		}
		this.setState(newState);
	}

	closeModifiers() {
		document.getElementById('lab-search-box').classList.add('hide');
	}

    updateSearch(event) {
        this.setState({search: event.target.value})
    }

    executeSearch(event) {
        if (event.key === 'Enter') {
            labSearch(this.state.areas, this.state.skills, this.state.commitments, this.state.departments, this.state.search).then((resp) => {
                console.log(resp);
            })
        }
    }

	render() {
		var filterContentArr = [];
		filterTypes.map(type => {
			var filterContent =
				<ul className = "search-filter-content">
					{this.state.parentFilts[type].map((filt) => {
						var subFiltSection = null;
						if (this.state.filts[type][filt.slug].clicked &&
								filt.subFilts && filt.subFilts.length > 0) {

							subFiltSection =
								<ul className="subfilter">
									{filt.subFilts.map((subFiltSlug) => {
										var subFilt = this.state.filts[type][subFiltSlug];
										return (
											<li key={subFilt.slug}>
												<input type="checkbox"
													className="checkbox-white filled-in"
                                                    onClick={() => this.handleFilterClick(type, filt.slug)}
													id={subFilt.slug}/>
												<label
													className="filter-checkbox-label"
													for={subFilt.slug}>
													{subFilt.friendlyName}
												</label>
											</li>)})}
								</ul>
						}
						var labelContent = null;
						if (filt.subFilts && filt.subFilts.length > 0) {
							var expandCSS = this.state.filts[type][filt.slug].clicked ?
								"search-expand-less" : "search-expand-more";
							labelContent =
								<li key={filt.slug}>
									<div className="filter-dropdown-container">
										<a className={expandCSS}
											 id={filt.slug}>
												<i className="material-icons">
													{this.state.filts[type][filt.slug].clicked ?
														"expand_less" : "expand_more"}
												</i>
											</a>
										<div className="filter-dropdown-label">{filt.friendlyName}</div>
									</div>
									{subFiltSection}
								</li>
						}
						else {
							labelContent =
								<li key={filt.slug}>
									<input type="checkbox"
										className="checkbox-white filled-in"
                                        onClick={() => this.handleFilterClick(type, filt.slug)}
										id={filt.slug}/>
									<label
										className="filter-checkbox-label"
										for={filt.slug}>{filt.friendlyName}</label>
								</li>
						}
						return (labelContent);
					})}
				</ul>

				filterContentArr.push(<div className="search-filter-content-wrapper">
					{filterContent}</div>);
		})

	var searchSideBar =
		<div className="search-sidebar">
			{filterTypes.map((type, idx) => {
				return (
					<div id={`${type}-filter`} className="search-filter-container">
						<div className="search-filter-title">{filterFriendlyNames[idx]}</div>
						<ExpanderIcons id={`${type}-filter`} classBase='search-filter-container' action={() => {this.expand(type)}} filterDropdown={true}/>
						<hr className="filter-hr"/>
						{filterContentArr[idx]}
					</div>
				)
			})}
		</div>
		return (
			<div className='lab-srch-2'>
               <div className='lab-srch-mods'>
                   {searchSideBar}
               </div>
               <div className='lab-srch-body'>
                   <input id='lab-srch-input' type='text' placeholder='keywords' onChange={event => this.updateSearch(event)} onKeyPress={event => this.executeSearch(event)}/>
                   <div id='lab-srch-result-summary'>Projects 1-50 (157 total) page 1 of 40 for <b>{this.state.search}</b></div>
                   <div id='lab-srch-results'>
                        {this.state.all_labs}
                   </div>
                   <div id='lab-srch-more' onClick={()=>{alert('load em')}}>Mo' labs, mo' problems</div>
               </div>
			</div>
		);
	}
}

export default LabSearch;
