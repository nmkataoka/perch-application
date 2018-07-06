import React, {Component} from 'react';
// import './LabSearch.css';
import './LabSearch2.css';
import ExpanderIcons from '../utilities/ExpanderIcons'
// import Bubble from '../utilities/Bubble';
// import LabList from './LabList';
import LabSearchItem from './LabSearchItem';

import '../user/individual/PickYourInterests.css';
import {getAllLabs, getLabTags, isLoggedIn, getCurrentUserId, getStudentFromUser, getAllSkills, getAllTags, getStudentSkills, getStudentTags, getUser} from '../../helper.js'
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
			getFilters(type).map(filt => {
				if (!filt.isSubFilt) {
					parentFilts[type].push(filt);
				}
			  filts[type][filt.slug] = filt;
			})
		})

		this.state = {
			filts,
			parentFilts,
			skills_catalog: [],
			your_skills: [],
			interests_catalog: [],
			your_interests: [],
			skills: [],
			interests: [],
			filtered_catalog: [],
			in_filter: false,
			search_skills: true,
			search_interests: false,
			all_labs: [],
			filtered_labs: [],
			s_id: '',
      search: '',
		}
	}

	expand(type) {
		document.getElementById(`${type}-filter`).classList.toggle('expand')
	}

	// componentWillMount() {
	// 	getAllSkills().then((resp) => {
	// 		var temp_arr = [];
	// 		resp.result.map((skill) => {
	// 			temp_arr.push(skill.name);
	// 		})
	// 		this.setState({skills_catalog: temp_arr, filtered_catalog: temp_arr});
	// 	});

	// 	getAllTags().then((resp) => {
	// 		var temp_arr = [];
	// 		resp.result.map((tag) => {
	// 			temp_arr.push(tag.name);
	// 		})
	// 		this.setState({interests_catalog: temp_arr});
	// 	});

 //        getUser(getCurrentUserId()).then(resp => {
 //            if (resp.result.is_student) {
 //                getStudentFromUser(getCurrentUserId()).then( r => {
 //                    this.setState({s_id: r.result.id});
 //                    getStudentSkills(this.state.s_id).then((resp) => {
 //                        var temp_arr = [];
 //                        resp.map((skill) => {
 //                            temp_arr.push(skill.name);
 //                        });
 //                        this.setState({your_skills: temp_arr});
 //                    });
 //                });

 //                getStudentFromUser(getCurrentUserId()).then( r => {
 //                    this.setState({s_id: r.result.id});
 //                    getStudentTags(this.state.s_id).then((resp) => {
 //                        var temp_arr = [];
 //                        resp.map((tag) => {
 //                            temp_arr.push(tag.name);
 //                        });
 //                        this.setState({your_interests: temp_arr});
 //                    });
 //                });
 //            }
 //        });
 //  	}

 //  	componentDidMount() {
 //  		getAllLabs().then((resp) => {
 //            var temp_arr = [];
	// 		for (var key in resp.result) {
	// 			temp_arr.push(resp.result[key]);
	// 		}
	// 		this.setState({all_labs: temp_arr});

	//   		let temp_labs = this.state.all_labs;
	//   		temp_labs.map((lab) => {
	//   			lab.in_search = false;
	//   			lab.tags_in = 0;
	//   			lab.name = lab.data.name;
	//   			lab.img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtlIs7sEURBC_LR2LM9_Fapi8onFUZt5WPUo9OIS040TGww7QY';

	//   			var tag_temp_arr = [];
	// 			lab.tags.map((tag) => {
	// 				tag_temp_arr.push(tag.name);
	// 			});
	// 			var skill_temp_arr = [];
	// 			lab.skills.map((skill) => {
	// 				skill_temp_arr.push(skill.name);
	// 			});

	// 			var temp_all_arr = tag_temp_arr;
	// 			skill_temp_arr.map((skill) => {
	// 				temp_all_arr.push(skill);
	// 			});

	// 			lab.tag_arr = tag_temp_arr;
	// 			lab.skill_arr = skill_temp_arr;
	// 			lab.all_tags = temp_all_arr;
	//   		});
	//   		this.setState({all_labs: temp_labs, filtered_labs: temp_labs});
	//   		console.log(this.state.all_labs);

	//   		document.getElementById('lab-topic').addEventListener('click', () => document.getElementById('lab-search-box').classList.remove('hide'))
	//   		// document.getElementById('lab-search').addEventListener("mouseleave", () => document.getElementById('lab-search-box').classList.add('hide'));
 //        });
 //  	}

	filterList(event) {
		if (this.state.search_skills) {
			var updatedList = this.state.skills_catalog;
		}
		else {
			var updatedList = this.state.interests_catalog;
		}
    	updatedList = updatedList.filter(function(item){
      	return item.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").search(
        	event.target.value.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")) !== -1;
    	});
    	this.setState({filtered_catalog: updatedList, in_filter: true});
	}

	handleFilterClick(filterType, slug) {
		var newState = this.state;
		if (newState.filts[filterType][slug].clicked) {
			newState.filts[filterType][slug].clicked = false;
		} else {
			newState.filts[filterType][slug].clicked = true;
		}
		this.setState(newState);
	}

	handleClickAdd(interest, temporary) {
		if (!this.state.skills.length && !this.state.interests.length) {
			this.setState({filtered_labs: []});
		}
		this.state.all_labs.map((lab) => {
            if (lab.all_tags.indexOf(interest) !== -1) {
                if (!lab.in_search) {
                    let temp_lab = lab;
                    temp_lab.in_search = true;
                    temp_lab.tags_in++;
                    this.setState((prevState) => {filtered_labs: prevState.filtered_labs.push(temp_lab)});
                }
                else {
                    let temp_lab = lab;
                    temp_lab.tags_in++;
                }
            }
        });
        this.setState((prevState) => {
            if (this.state.search_skills) {
                let temp_delete = prevState.skills_catalog;
                let temp_filter = prevState.filtered_catalog;
                temp_delete.splice(temp_delete.indexOf(interest), 1);

                if (temporary !== "default") {
                    temp_filter.splice(temp_filter.indexOf(interest), 1);
                }
                else if (this.state.in_filter) {
                    temp_filter.splice(temp_filter.indexOf(interest), 1);
                }

                let temp_add = prevState.skills;
                    temp_add.push(interest);
                    return {skills: temp_add, skills_catalog: temp_delete, filtered_catalog: temp_filter};
            }
            else {
                let temp_delete = prevState.interests_catalog;
                let temp_filter = prevState.filtered_catalog;
                temp_delete.splice(temp_delete.indexOf(interest), 1);

                if (temporary !== "default") {
                    temp_filter.splice(temp_filter.indexOf(interest), 1);
                }
                else if (this.state.in_filter) {
                    temp_filter.splice(temp_filter.indexOf(interest), 1);
                }
                let temp_add = prevState.interests;
                    temp_add.push(interest);
                    return {interests: temp_add, interests_catalog: temp_delete, filtered_catalog: temp_filter};
            }
        });
	}

	handleClickDelete(interest, type, temporary) {
		this.state.all_labs.map((lab) => {
            if (lab.all_tags.indexOf(interest) !== -1) {
                if (lab.in_search && (lab.tags_in === 1)) {
                    let temp_lab = lab;
                    temp_lab.in_search = false;
                    temp_lab.tags_in--;

                    let temp_filtered_labs = this.state.filtered_labs;
                    let indx = this.state.filtered_labs.indexOf(lab);
                    temp_filtered_labs.splice(indx, 1);

                    this.setState((prevState) => {filtered_labs: temp_filtered_labs});
                }
                else {
                    lab.tags_in--;
                }
            }
        });
        this.setState((prevState) => {
            if (type === 'skill') {
                var temp_delete = prevState.skills;
                var temp_add = prevState.skills_catalog;
                var temp_filter = prevState.filtered_catalog;
                temp_add.push(interest);
                temp_delete.splice(temp_delete.indexOf(interest), 1);

                let check = prevState.in_filter;
                if (interest.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").includes(
                	temporary.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").toString())) {
                    if (temporary !== "default") {
                        temp_filter.push(interest);
                    }
                }
                else if (check && (temporary == "default")) {
                    temp_filter.push(interest);
                }

                if (prevState.search_interests) {
                	if (!temp_delete.length && !this.state.interests.length) {
			        	return {filtered_labs: prevState.all_labs, skills: temp_delete, skills_catalog: temp_add, filtered_catalog: temp_filter};
					}
                    return {skills: temp_delete, skills_catalog: temp_add, filtered_catalog: temp_filter};
                }
                else {
                	if (!temp_delete.length && !this.state.interests.length) {
			        	return {filtered_labs: prevState.all_labs, skills: temp_delete, skills_catalog: temp_add};
					}
                    return {skills: temp_delete, skills_catalog: temp_add};
                }
            }
            else {
                var temp_delete = prevState.interests;
                var temp_add = prevState.interests_catalog;
                var temp_filter = prevState.filtered_catalog;
                temp_add.push(interest);
                temp_delete.splice(temp_delete.indexOf(interest), 1);

                let check = prevState.in_filter;
                if (interest.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").includes(
                	temporary.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").toString())) {
                    if (temporary !== "default") {
                        temp_filter.push(interest);
                    }
                }
                else if (check && (temporary == "default")) {
                    temp_filter.push(interest);
                }

                if (prevState.search_skills) {
                	if (!temp_delete.length && !this.state.skills.length) {
			        	return {filtered_labs: prevState.all_labs, interests: temp_delete, interests_catalog: temp_add, filtered_catalog: temp_filter};
					}
                    return {interests: temp_delete, interests_catalog: temp_add, filtered_catalog: temp_filter};
                }
                else {
                	if (!temp_delete.length && !this.state.skills.length) {
			        	return {filtered_labs: prevState.all_labs, interests: temp_delete, interests_catalog: temp_add};
					}
                    return {interests: temp_delete, interests_catalog: temp_add};
                }
            }
        });
	}

	handleSearchType(event) {
		let temporary = "default";
		if (document.getElementById('lab-topic')) {
			let len = document.getElementById('lab-topic').value.length;
			if (len !== 0) {
				temporary = document.getElementById('lab-topic').value;
			}
		}
		if (event.target.value === 'skills') {
			this.setState((prevState) => {
				var updatedList = this.state.skills_catalog;
				if (temporary !== "default") {
			    	updatedList = updatedList.filter(function(item){
			      	return item.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").search(
			        	temporary.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")) !== -1;
			    	});
				}
				else {
					updatedList = this.state.skills_catalog;
				}
				return {filtered_catalog: updatedList,
						search_skills: true,
						search_interests: false};
			});
		}
		else {
			this.setState((prevState) => {
				var updatedList = this.state.interests_catalog;
				if (temporary !== "default") {
			    	updatedList = updatedList.filter(function(item){
			      	return item.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").search(
			        	temporary.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")) !== -1;
			    	});
				}
				else {
					updatedList = this.state.interests_catalog;
				}
				return {filtered_catalog: updatedList,
						search_skills: false,
						search_interests: true};
			});
		}
	}

	handleImport(import_type, temporary) {
		if (!this.state.skills.length && !this.state.interests.length) {
			this.setState({filtered_labs: []});
		}
		if (import_type === 'skills') {
            this.state.your_skills.map((skill) => {
                this.state.all_labs.map((lab) => {
                    if (lab.skill_arr.indexOf(skill) !== -1) {
                        if (!lab.in_search) {
                            let temp_lab = lab;
                            temp_lab.in_search = true;
                            temp_lab.tags_in++;
                            this.setState((prevState) => {filtered_labs: prevState.filtered_labs.push(temp_lab)});
                        }
                        else {
                        	let temp_check = this.state.skills_catalog;
                        	if (temp_check.indexOf(skill) !== -1) {
                        		lab.tags_in++;
                        	}
                        }
                    }
                });
            });
            this.setState((prevState, import_type) => {
                let temp_delete = prevState.skills_catalog;
                let temp_filter = prevState.filtered_catalog;
                let temp_add = prevState.skills;

                prevState.your_skills.map((skill) => {
                    if (temp_delete.indexOf(skill) !== -1) {
                        temp_delete.splice(temp_delete.indexOf(skill), 1);
                    }
                    if ((temporary !== "default") && (temp_filter.indexOf(skill) !== -1)) {
                        temp_filter.splice(temp_filter.indexOf(skill), 1);
                    }
                    else if (this.state.in_filter && (temp_filter.indexOf(skill) !== -1)) {
                        temp_filter.splice(temp_filter.indexOf(skill), 1);
                    }

                    if (prevState.skills.indexOf(skill) === -1) {
                        temp_add.push(skill);
                    }
                });
                return {skills: temp_add, skills_catalog: temp_delete, filtered_catalog: temp_filter};
            });
        }
        else {
            this.state.your_interests.map((interest) => {
                this.state.all_labs.map((lab) => {
                    if (lab.tag_arr.indexOf(interest) !== -1) {
                        if (!lab.in_search) {
                            let temp_lab = lab;
                            temp_lab.in_search = true;
                            temp_lab.tags_in++;
                            this.setState((prevState) => {filtered_labs: prevState.filtered_labs.push(temp_lab)});
                            console.log('hi');
                            console.log(lab.tags_in);
                        }
                        else {
                        	let temp_check = this.state.interests_catalog;
                        	if (temp_check.indexOf(interest) !== -1) {
                        		lab.tags_in++;                        	}
                        }
                    }
                });
            });
            this.setState((prevState, import_type) => {
                let temp_delete = prevState.interests_catalog;
                let temp_filter = prevState.filtered_catalog;
                let temp_add = prevState.interests;

                prevState.your_interests.map((interest) => {
                    if (temp_delete.indexOf(interest) !== -1) {
                        temp_delete.splice(temp_delete.indexOf(interest), 1);
                    }
                    if ((temporary !== "default") && (temp_filter.indexOf(interest) !== -1)) {
                        temp_filter.splice(temp_filter.indexOf(interest), 1);
                    }
                    else if (this.state.in_filter && (temp_filter.indexOf(interest) !== -1)) {
                        temp_filter.splice(temp_filter.indexOf(interest), 1);
                    }

                    if (prevState.interests.indexOf(interest) === -1) {
                        temp_add.push(interest);
                    }
                });
                return {interests: temp_add, interests_catalog: temp_delete, filtered_catalog: temp_filter};
            });
        }
	}

	closeModifiers() {
		document.getElementById('lab-search-box').classList.add('hide');
	}

    updateSearch(event) {
        this.setState({search: event.target.value})
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
											 onClick={() => this.handleFilterClick(type, filt.slug)}
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
                   <input id='lab-srch-input' type='text' placeholder='keywords' onChange={event => this.updateSearch(event)}/>
                   <div id='lab-srch-result-summary'>Projects 1-50 (157 total) page 1 of 40 for <b>{this.state.search}</b></div>
                   <div id='lab-srch-results'>
                        <LabSearchItem name="Meha Patel's Lab" dept='English' rsrch='12th century grammar analysis' img='/img/meha.jpg' description='We love words. Especially old, hard to understand words.'/>
                        <LabSearchItem name='Sara Alektar' dept='Physics' rsrch='nuclear coffee decay' img='/img/sara.jpg' description="We make coffee, smell cofee, drink coffee, freeze coffee, sublimate coffee, distill cofee, and watch cofee. You should join!"/>
                        <LabSearchItem name='Sanjay B.' dept='Chemistry' rsrch='chromatography race betting' img='/img/sanjay.jpg' description='If the school asks, this does not exist.'/>
                        <LabSearchItem name='Nolan Kataoka' dept='Dance' rsrch='expressive feet dance' img='/img/nolan.jpg' description='We strongly feel feet are the window to the soul'/>
                   </div>
               </div>
			</div>
		);
	}
}

export default LabSearch;