import React from 'react'
import { StyleSheet, Image } from 'react-native';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail'
import Favorites from '../Components/Favorites'
import Test from '../Components/Test'

const SearchStackNavigator = createStackNavigator({
	Search: {																	//we don't have to put the same name as our components
		screen: Search,
		navigationOptions: {
			title: 'Rechercher'
		}
	},
	FilmDetail: {
		screen: FilmDetail
	}
})

const FavoritesStackNavigator = createStackNavigator({
	Favorite:{
		screen: Favorites,
		navigationOptions: {
			title: 'Favoris'
		}
	},
	FilmDetail: {
		screen: FilmDetail
	}
})

const MoviesTabNavigator = createBottomTabNavigator(
	{
		Search: {
			screen: SearchStackNavigator,
			navigationOptions: {
				tabBarIcon: () => {
					return <Image
						source={require('../Images/ic_search.png')}
						style={styles.icon}/>
				}
			}
		},
		Favorites: {
			screen: FavoritesStackNavigator,
			navigationOptions: {
				tabBarIcon: () => {
					return <Image
						source={require('../Images/ic_favorite.png')}
						style={styles.icon}/>
				}
			}
		},
		Test: {
			screen: Test
		}
	},
	{
		tabBarOptions: {
			activeBackgroundColor: '#DDDDDD',
			inactiveBackgroundColor: '#FFFFFF',
			showLabel: false,
			showIcon: true
		}
	}
)

const styles = StyleSheet.create({
	icon: {
		width: 30,
		height: 30
	}
})

export default createAppContainer(MoviesTabNavigator)
