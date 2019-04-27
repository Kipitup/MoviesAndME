import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {
	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		film: undefined,
	// 		isLoading: true
	// 	}
	// }

	state = {
		film: undefined,
		isLoading: true
	}

	// componentDidMount() {
	// 	getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
	// 	  this.setState({
	// 		film: data,
	// 		isLoading: false
	// 	  })
	// 	})
	// }

	// async componentDidMount() {
	// 	const data = await getFilmDetailFromApi(this.props.navigation.state.params.idFilm);
	//
	// 	this.setState({
	// 	  film: data,
	// 	  isLoading: false
	// 	})
	// }

	async componentDidMount() {
		this.setState({
		  film: await getFilmDetailFromApi(this.props.navigation.state.params.idFilm), //when 'await' always put 'async'| await replace '.then', it'll wait for the return. async function answer
		  isLoading: false														//		the problem of asynchrome. Before you add to use callback to differ the execution of instructions. better the Promise ?
		})
	}

	componentDidUpdate() {
		console.log("componentDidUpdate : ")
		console.log(this.props.favoritesFilm)
	}

	_displayLoading() {
		if (this.state.isLoading) {
			return (
				<View style={styles.loading_container}>
					<ActivityIndicator size='large'/>
				</View>
			)
		}
	}

	_toggleFavorite() {
		const action = { type: "TOGGLE_FAVORITE", value: this.state.film }		//Declaration of an Object
		this.props.dispatch(action)
	}

	_displayFavoriteImage() {
		var sourceImage = require('../Images/ic_favorite_border.png')			//require is used to statically include image & others.
		if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
			sourceImage = require('../Images/ic_favorite.png')
		}
		return (
			<Image
				style={styles.favorite_image}
				source={sourceImage}
			/>
		)
	}

	_displayFilm() {
		const { film } = this.state												//destructuring an object allows us to extrct multiple pieces of data from array or object and assign them to their own variables.
		return film && (														//instead of if (film != undefined) { return.....}. When if is false it will return undefined anyway
			<ScrollView style={styles.scrollview_container}>
				<Image
					style={styles.image}
		    		source={{uri: getImageFromApi(film.backdrop_path)}}
				/>
				<Text style={styles.title}>{film.title}</Text>
				<TouchableOpacity
				    style={styles.favorite_container}
				    onPress={() => this._toggleFavorite()}>
				    {this._displayFavoriteImage()}
				</TouchableOpacity>
				<Text style={styles.overview}>{film.overview}</Text>
				<Text style={styles.film_info}>
					Sorti le {moment(film.release_date).format('DD/MM/YYYY')}
				</Text>
				<Text style={styles.film_info}>
					Note : {film.vote_average} / 10
				</Text>
				<Text style={styles.film_info}>
					Nombre de votes : {film.vote_count}
				</Text>
				<Text style={styles.film_info}>
					Budget : {numeral(film.budget).format('0,0')} $
				</Text>
				<Text style={styles.film_info}>
					Genre(s) : {film.genres.map(({ name }) => name).join(" / ")}{/*Destructuring name from film.genre and return it*/}
				</Text>
				<Text style={styles.film_info}>
					Companie(s) : {film.production_companies.map(
						function({ name }){ return name}).join(" / ")}			{/*Same as above but not with arrow function*/}
				</Text>
			</ScrollView>
		)
	}

	render () {
		return (
			<View style={styles.main_container}>
				{this._displayLoading()}
				{this._displayFilm()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main_container: {
		flex: 1,
	},
	favorite_container: {
		alignItems: 'center'
	},
	favorite_image: {
		width: 40,
		height: 40
	},
	loading_container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	scrollview_container: {
		flex: 1
	},
	image: {
		height: 169,
		margin: 5
	},
	title: {
		flex: 1,
		flexWrap: 'wrap',
		textAlign: 'center',
		fontSize: 35,
		fontWeight: 'bold',
		marginLeft: 5,
	    marginRight: 5,
	    marginTop: 10,
	    marginBottom: 10,
	    color: '#000000'
	},
	overview: {
		fontStyle: 'italic',
		color: '#666666',
		margin: 5,
		marginBottom: 15
	},
	film_info: {
		marginLeft: 5,
	    marginRight: 5,
	    marginTop: 5
	}
})

const mapStateToProps = (state) => {
  return {
	  favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmDetail)
