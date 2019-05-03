import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import FilmItem from './FilmItem'
import { connect } from 'react-redux'

class FilmList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			films: []
		}
	}

	_displayDetailForFilm = (idFilm) => {										//auto binding with arrow function
		console.log("Display film " + idFilm)
    	this.props.navigation.navigate('FilmDetail', {idFilm: idFilm})			//https://openclassrooms.com/fr/courses/4902061-developpez-une-application-mobile-react-native/5046301-concevez-une-navigation-entre-vos-vues#/id/r-5046497
  	}

	render() {
		const { films, favoritesFilm, page, totalPages } = this.props			//Why can't we destructure the loadFilms function like in FilmItem ?
			if (this.props.favoriteList) {
				return (
				<FlatList
					style={styles.list}
					data={favoritesFilm}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({item}) => (
						<FilmItem
							film={item}
							isFilmFavorite={(favoritesFilm.findIndex(film => film.id === item.id) !== -1) ? true : false}
							displayDetailForFilm={this._displayDetailForFilm}
						/>
					)}
				/>
			)
			}
			else {
				return (
				<FlatList
					style={styles.list}
					data={films}
					extraData={favoritesFilm}
					keyExtractor={(item) => item.id.toString()}						//keyExtractor tells the list to use the ids for the react keys instead of the default key property.
					renderItem={({item}) => (
						<FilmItem
							film={item}
							isFilmFavorite={(favoritesFilm.findIndex(film => film.id === item.id) !== -1) ? true : false}
							displayDetailForFilm={this._displayDetailForFilm}
						/>
					)}
					onEndReachedThreshold={0.5}
					// onEndReached={page < totalPages ? this.props.loadFilms : null} //This does not work
					onEndReached={() => {
					  if (page < totalPages) {
						  this.props.loadFilms()
					  }
					}}
				/>
			)
			}
	}
}

const styles = StyleSheet.create({
	list: {
		flex: 1
	}
})

const mapStateToProps = state => {
	return {
		favoritesFilm: state.favoritesFilm
	}
}

export default connect(mapStateToProps)(FilmList)
