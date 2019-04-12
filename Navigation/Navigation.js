import { createStackNavigator, createAppContainer } from 'react-navigation'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail'

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

export default createAppContainer(SearchStackNavigator)
