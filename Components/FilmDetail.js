import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity, Share, Platform } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state
		if (params.film && Platform.OS === 'ios') {
			return {
				headerRight: (
					<TouchableOpacity
						style={styles.share_touchable_headerrightbutton}
						onPress={() => params.shareFilm()}>
						<Image
							style={styles.share_image}
							source={require('../Images/ic_share.png')}/>
					</TouchableOpacity>
				),
			};
		}
	};

	constructor(props) {
		super(props)
		this.state = {
			film: undefined,
			isLoading: true
		}
		this._toggleFavorite = this._toggleFavorite.bind(this)					//change
		this._shareFilm = this._shareFilm.bind(this)
	}

	_updateNavigationParam() {
		this.props.navigation.setParams({
			film: this.state.film,
			shareFilm: this._shareFilm
		});
	}

	// componentDidMount() {
	// 	getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
	// 	  this.setState({
	// 		film: data,
	// 		isLoading: false
	// 	  })
	// 	})
	// }

	async componentDidMount() {
		const favoriteFilmIndex = this.props.favoritesFilm.findIndex(
			item => item.id === this.props.navigation.state.params.idFilm)
		if (favoriteFilmIndex !== -1) {
			this.setState({
				film: this.props.favoritesFilm[favoriteFilmIndex]
			}, () => this._updateNavigationParam())
			return
		}
		this.setState({ isLoading: true })
		this.setState({
			film: await getFilmDetailFromApi(this.props.navigation.state.params.idFilm), //when 'await' always put 'async'| await replace '.then', it'll wait for the return. async function answer
			isLoading: false													//		the problem of asynchrome. Before you add to use callback to differ the execution of instructions. better the Promise ?
		}, () => this._updateNavigationParam())
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
      var sourceImage = require('../Images/ic_favorite_border.png')
      var shouldEnlarge = false // Par défaut, si le film n'est pas en favoris, on veut qu'au clic sur le bouton, celui-ci s'agrandisse => shouldEnlarge à true
      if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
        sourceImage = require('../Images/ic_favorite.png')
        shouldEnlarge = true // Si le film est dans les favoris, on veut qu'au clic sur le bouton, celui-ci se rétrécisse => shouldEnlarge à false
      }
      return (
        <EnlargeShrink
          shouldEnlarge={shouldEnlarge}>
          <Image
            style={styles.favorite_image}
            source={sourceImage}
          />
        </EnlargeShrink>
      )
    }

	_shareFilm() {
		const { film } = this.state
		Share.share({ title: film.title, message: film.overview })
	}

	_displayFloatingActionButton() {
		const { film } = this.state
		if (film && Platform.OS === 'android') {
			return (
				<TouchableOpacity
					style={styles.share_touchable_floatingactionbutton}
					onPress={() => this._shareFilm()}>
					<Image
						style={styles.share_image}
						source={require('../Images/ic_share.png')} />
				</TouchableOpacity>
			)
		}
	}

	_displayFilm() {
		const { film } = this.state												//destructuring an object allows us to extract multiple pieces of data from array or object and assign them to their own variables.
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
				{this._displayFloatingActionButton()}
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
		flex: 1,
		width: null,
		height: null
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
	},
	share_touchable_floatingactionbutton: {
		position: 'absolute',
		width: 60,
		height: 60,
		right: 30,
		bottom: 30,
		borderRadius: 30,
		backgroundColor: '#e91e63',
		justifyContent: 'center',
		alignItems: 'center'
	},
	share_image: {
		width: 30,
		height: 30
	},
	share_touchable_headerrightbutton: {
		marginRight: 8
	}
})

const mapStateToProps = (state) => {
  return {
	  favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmDetail)
