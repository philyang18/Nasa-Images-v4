import React from 'react';
import { fetchAPOD } from './NasaAPIs';
import { formatDisplayDate } from './Formatting';
import Loading from './Loading';
import Iframe from 'react-iframe';
import thumbnail from './images/play-thumbnail.jpeg';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
			apod: [],
			previousSeven: [],
			loading: false,
			hiddenClass: 'hide-description'
        };
	}
	componentDidMount = async () => {
		this.setState( { loading: true });
		// const apod = await fetchAPOD("2019-10-1");
		const apod = await fetchAPOD();
		this.setState({ apod });
		this.state.previousSeven.push([]);
        this.state.previousSeven[0].push(apod);
		this.setState( { mainLoading: false });
		const currentDate = apod.date;
		const dateComponents = currentDate.split('-');
		var year = Number(dateComponents[0]), month = Number(dateComponents[1]), day = Number(dateComponents[2]);
		for( var i = 1; i < 7; i++) {
			if (day === 1){
				month -= 1;
				if(month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
					day = 30;
				} else if (month === 3 ) {
					if (year % 4 === 0) {
						day = 29;
					} else {
						day = 28;
					}
				} else if (month === 1) {
					day = 31;
					month = 12;
					year -= 1;
				} else {
					day = 30;
				}
			} else {
				day -= 1;
			}
			const newDate = String(year) + "-" + String(month) + "-" + String(day);
			this.state.previousSeven.push([]);
            this.state.previousSeven[i].push( await fetchAPOD(newDate) );
		}
		this.setState({ loading: false });
		console.log(this.state.previousSeven);
	}
	handleClick = (photo) => {
		window.scrollTo(0, 0)
		if(photo.date !== this.state.apod.date) {
			this.setState({ apod: photo });
		}
	} 

    render() {
        return(
			<div id="homePage"> 
				{this.state.loading ? <Loading/> : 
					<div className="container">
						<h1 id="home-title">NASA Photo of the Day</h1>		
						<div className="row">
							<div id="main-image" className="col-lg-9 col-md-9 col-sm-12">
								<div className="col-12">
									{this.state.apod.media_type !== "video" ?
										<img src={this.state.apod.hdurl} alt={this.state.apod.title}/> :
										<Iframe src={this.state.apod.url} width="100%"frameBorder="0" allowFullScreen/>
									}
								</div>
								<div id="apod-details" className="col-12">
									<p id="apod-date">{formatDisplayDate(this.state.apod.date)}</p>
									<p><strong>{this.state.apod.title}</strong></p>
									<DescriptionButton className="d-xl-none d-lg-none d-md-none d-sm-block" description={this.state.apod.explanation} />
									{/* <p id="apod-description" className="d-lg-block d-md-block d-sm-none">{this.state.apod.explanation}</p> */}
									{/* <p id="apod-description-button" className="d-lg-none d-md-none d-sm-block col-12" onClick={this.handleButtonClick}>Click to Read Description...</p> */}
									{/* <p id="apod-description" className={this.state.hiddenClass}>{this.state.apod.explanation}</p> */}
									<p id="apod-description" className="d-xl-block d-lg-block d-md-block d-sm-none">{this.state.apod.explanation}</p>
									{this.state.apod.copyright ? 
										<p>Credit: {this.state.apod.copyright}</p> : <p></p>
									}
								</div>
							</div>
							<div id="previous-image-column" className="col-lg-3 col-md-3 col-sm-12">
								{this.state.previousSeven.map(last => {
									if (last[0].media_type === "video"){
										if(last[0].date === this.state.apod.date) {
											return (
												<img src={thumbnail} className="col-12 previous-image active" onClick={() => this.handleClick(last[0])} alt={last[0].title}/>
											)
										} else {
											return (
												<img src={thumbnail} className="col-12 previous-image" onClick={() => this.handleClick(last[0])} alt={last[0].title} />
											);
										}
									} else {
										if(last[0].date === this.state.apod.date) {
											return (
												<img src={last[0].hdurl} className="col-12 previous-image active" onClick={() => this.handleClick(last[0])} alt={last[0].title} />
											);
										} else {
											return (
												<img src={last[0].hdurl} className="col-12 previous-image" onClick={() => this.handleClick(last[0])} alt={last[0].title} />
											);
										}
									}
								})}
							</div>
						</div>
					</div>
				}
			</div>
           
        );
    }
}

class DescriptionButton extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			description: '',
			hiddenClass: 'hide-description'
		};
	}
	componentDidMount() {
		this.setState({ description: this.props.description });
		console.log(this.state.description);
		console.log(this.props.description);
	}
	handleButtonClick = () => {
		this.setState({ hiddenClass: "show-description"});
	}
	render() {
		if(this.state.description !== this.props.description) {
			this.setState({ hiddenClass: "hide-description", description: this.props.description});
		}
		return (
			<div>
				<p id="apod-description-button" className="col-12" onClick={this.handleButtonClick}>Click to Read Description...</p>
				<p id="apod-description" className={this.state.hiddenClass}>{this.state.description}</p>
			</div>					
		);
	}
	
}