import React, { Component } from 'react'
import { SectionList, View, Text, StyleSheet, Picker,TouchableHighlight, TouchableOpacity, ScrollView,ActivityIndicator, AsyncStorage,TouchableNativeFeedback, Image, Share,ToastAndroid,PanResponder } from 'react-native'

import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator, createSwitchNavigator } from "react-navigation"
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

////////////////////////////**Starts**///////////////////////////////////////////////////////
import { InfoSection,movieInfoScreen, } from './Components/InfoSection'
import { TitbitsSection } from './Components/TitbitsSection'
import { HelpSection } from './Components/HelpSection'
import { RatingSection, LoginScreen,RateReviewScreen, AuthLoadingScreen } from './Components/RatingSection'
////////////////////////////**Ends**/////////////////////////////////////////////////////////
//////////////////////////////**starts**/////////////////////////////////////////////////////
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, persistReducer  } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react'
import { reducer,actionCreators } from './MovieReducer' // Import the reducer and create a store
const persistConfig = {
	key: 'root',
	storage: storage,
}
const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store); // to enable persistence
//persistor.purge(); //To Clear Temp Storage
///////////////////////////////**Ends**/////////////////////////////////////////////////////////////////////

const extractKey = ({id}) => id

class Released extends Component {
			state = { 
					secData:[],
					isFetching: false,
					fetchCount: 18,
					isLoadingMore: false,
					totalMovies:'',
					updateCountInt:18,
					listPulled: false,		
					truecount:'',
					stopupdate:true					
			}
			_panResponder = {};
			componentWillMount() {
				this._panResponder = PanResponder.create({
				  onMoveShouldSetPanResponderCapture: () => true,			
				});
			}
			componentDidMount() {
					this.getlist();
					let currentValue
					handleChange=()=>{
						  let previousValue = currentValue
						  currentValue = store.getState().dropVal
						  if (previousValue !== currentValue) {
								this.setState({listPulled:false});
								this.getlist() //this.forceUpdate() Not required as updating state itself triggers component re rendering
								return true;
				  		  }
					}
				const unsubscribe = store.subscribe(handleChange)
			}
			
		_gotoDetails=(item)=>{
				this.props.navigation.navigate('Details', { movieTitle: item.title, movieId:item.id})			
		}			

		getlist=async(fetchUpdate)=> {
        		fetchUpdate=(fetchUpdate==undefined)?this.state.fetchCount:fetchUpdate;
        		this.setState({fetchCount:this.state.fetchCount+fetchUpdate})
					const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/movies?status=released&limit='+this.state.fetchCount+'&language='+store.getState().dropVal;
							const response = await fetch(URL)
							const listjson = await response.json();
							if(listjson!=null){
									var group_to_values = listjson.reduce(function (obj, item) {var d = new Date(item.release_date);var year = d.getFullYear();
									var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
									var month=months[d.getMonth()];month = month.substring(0,3);
									var month_year=month+' '+year;
									
									obj[month_year] = obj[month_year] || [];
									obj[month_year].push({"id":item.id, "genre":item.genre, "language":item.language, "logo_url":item.logo_url, "rating":item.rating, "release_date":item.release_date, "title":item.title, "top_cast_for_list":item.top_cast_for_list,"photosmallID":item.photosmallID,"totalMovies":item.totalMovies});
									return obj;
								}, {});
								
								var groups = Object.keys(group_to_values).map(function (key) {
									return {title: key, data: group_to_values[key]};
								})
							}
							else {
									return false;
							}
							this.setState({ secData: groups,"totalMovies":groups[0]['data'][0]["totalMovies"], listPulled:true })
	}

	renderItem = ({item}) => {
		return (
		<View {...this._panResponder.panHandlers}> 
		<TouchableOpacity onPress={() => {this._gotoDetails(item)} } delayPressIn={50}>
			<View style={styles.rownew}>
				<View style={styles.column1}>
					<Image style={styles.movieListIcon} source={{uri:`${item.logo_url}`}} />
				</View>
				  
				<View style={styles.column2}>
						<Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}> {item.title}	</Text>
						<Text style={[styles.row,styles.cast]} ellipsizeMode='tail' numberOfLines={1}> {item.top_cast_for_list} </Text>
					<View style={styles.dategenreWr}><Text style={styles.date}> {item.release_date}</Text><Text style={styles.genre}>| {item.genre}</Text></View>
					{(store.getState().dropVal=="All Movies")&&<Text style={styles.languageinAll}> {item.language}</Text>}
				</View>
                <View style={styles.column3}>{item.rating==null?null:(<Text style={[styles.listRating,item.rating<2.5? styles.listRatingLow:item.rating<4?styles.listRatingMedium:styles.listRatingHigh]}>{parseFloat(item.rating)}</Text>)}</View>
			</View>
		</TouchableOpacity>
		</View>
		)
	  }

	renderSectionHeader = ({section}) => {
				return (<Text style={styles.sectionheader}> {section.title} </Text>)
	}

	onRefreshHandle = () => {
			//if (!this.state.isConnected) {
				//this.showNoInternet();
			//}
			//else {
				this.setState({isFetching: true});
				this.getlist().then(() => {
						this.setState({isFetching: false});
					}
			)};
	//}

  render() {
      if (this.state.listPulled == false) {
      		return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator size="large" color="#0099ff"/></View>)
      }
      else {
          return (
              <SectionList
                  contentContainerStyle={styles.listContainer}
                  sections={this.state.secData}
                  renderItem={this.renderItem}
                  renderSectionHeader={this.renderSectionHeader}
                  keyExtractor={extractKey}
                  onRefresh={this.onRefreshHandle}
                  refreshing={this.state.isFetching}
                  onScroll={({nativeEvent}) => {
						  const updateCount = (((nativeEvent.layoutMeasurement.height) / 77) * 1)
						  const updateCountInt = parseInt(updateCount);
						  
						  if(parseInt(this.state.updateCountInt) + updateCountInt >= this.state.totalMovies) {
							  this.setState({isLoadingMore: false});
						  }
						  if(nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height) {
							  this.setState({updateCountInt: this.state.updateCountInt + updateCountInt})
							  
							  this.setState({truecount: this.state.fetchCount+updateCountInt})
							  if(this.state.stopupdate==true){
								  this.getlist(updateCountInt)
							  }
							   if(this.state.truecount>this.state.totalMovies){
								   this.setState({stopupdate: false})
							   }
						  }
                  }}
                  onEndReached={() => this.setState({isLoadingMore: true})}
                  ListFooterComponent={() => {
					  if(!(this.state.truecount>this.state.totalMovies)){
                      return ( this.state.isLoadingMore &&
                          <View style={{flex: 1, padding: 15}}>
                              <ActivityIndicator size="small" color="#0099ff"/>
					  </View> );}
  					  return null;
                  }}
              />
          );
      }
  }
}

class Upcoming extends Component {
			state = {
					secData:[],
					isFetching: false,
					fetchCount: 18,
					//isLoadingMore: false,
					//totalMovies:'',
					updateCountInt:18,
					listPulled: false,		
					//truecount:'',
					stopupdate:true		
			}
			componentDidMount() {
					this.getlist();
					let currentValue
					handleChange2=()=>{
					  	let previousValue = currentValue
					  	currentValue = store.getState().dropVal
					  	if (previousValue !== currentValue) {
							 this.setState({listPulled:false});
							 this.getlist()
							 return true;
				  		}
					}
					const unsubscribe = store.subscribe(handleChange2)
			}
		_gotoDetails(item){
				this.props.navigation.navigate('Details', { movieTitle: item.title, movieId:item.id})			
		}	
		
	getlist=async()=> {
        		const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/movies?status=upcoming&limit='+this.state.fetchCount+'&language='+store.getState().dropVal;
				const response = await fetch(URL)
				const listjson = await response.json();
						if(listjson!=null){
							        var group_to_values = listjson.reduce(function (obj, item) {var d = new Date(item.release_date);var year = d.getFullYear();
									var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
									var month=months[d.getMonth()];month = month.substring(0,3);
									var month_year=month+' '+year;

									obj[month_year] = obj[month_year] || [];
									obj[month_year].push({"id":item.id, "genre":item.genre, "language":item.language, "logo_url":item.logo_url, "rating":item.rating, "release_date":item.release_date, "title":item.title, "top_cast_for_list":item.top_cast_for_list,"photosmallID":item.photosmallID,"totalMovies":item.totalMovies});
									return obj;
								}, {});
								var groups = Object.keys(group_to_values).map(function (key) {
									return {title: key, data: group_to_values[key]};
								})
								//groups=groups.reverse();
							}
							else {
								return false;
							}

				this.setState({
                    secData: groups,"totalMovies":groups[0]['data'][0]["totalMovies"],listPulled:true
				})
	}

	renderItem = ({item}) => {
		return (
		<TouchableOpacity onPress={() => {this._gotoDetails(item)} } delayPressIn={50}>
			<View  style={styles.rownew}>
				<View style={styles.column1}>
					<Image style={styles.movieListIcon} source={{uri:`${item.logo_url}`}}  />
				</View>

				<View style={styles.column2}>
						<Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}> {item.title}	</Text>
						<Text style={[styles.row,styles.cast]} ellipsizeMode='tail' numberOfLines={1}> {item.top_cast_for_list} </Text>
                    <View style={styles.dategenreWr}><Text style={styles.date}> {item.release_date}</Text><Text style={styles.genre}>| {item.genre}</Text></View>
					{(store.getState().dropVal=="All Movies")&&<Text style={styles.languageinAll}> {item.language}</Text>}
				</View>
			</View>
		</TouchableOpacity>)
	  }

	 renderSectionHeader = ({section}) => {
			return (<Text style={styles.sectionheader}>{section.title}</Text>)
	  }

	onRefreshHandle = () => {
			//if (!this.state.isConnected) {
				//this.showNoInternet();
			//}
			//else {
				this.setState({isFetching: true});
				this.getlist().then(() => {
						this.setState({isFetching: false});
					}
			)};
	//}

  render() {
      if (this.state.listPulled == false) {
          return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator size="large" color="#0099ff"/></View>)
      } else {
          return (
              <View>
              <SectionList
                  contentContainerStyle={styles.listContainer}
                  sections={this.state.secData}
                  renderItem={this.renderItem}
                  renderSectionHeader={this.renderSectionHeader}
                  keyExtractor={extractKey}
                  onRefresh={this.onRefreshHandle}
                  refreshing={this.state.isFetching}
                  onScroll={({nativeEvent}) => {
						  const updateCount = (((nativeEvent.layoutMeasurement.height) / 77) * 3)
						  const updateCountInt = parseInt(updateCount);
						  
						  if(parseInt(this.state.updateCountInt) + updateCountInt >= this.state.totalMovies) {
							  this.setState({isLoadingMore: false});
						  }
						  if(nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height) {
							  this.setState({updateCountInt: this.state.updateCountInt + updateCountInt})
							  
							  this.setState({truecount: this.state.fetchCount+updateCountInt})
							  if(this.state.stopupdate==true){
								  this.getlist(updateCountInt)
							  }
							   if(this.state.truecount>this.state.totalMovies){
								   this.setState({stopupdate: false})
							   }
						  }
                  }}

              />
              </View>
          );
      }
  }
}

class DetailsScreen extends Component {
		constructor () {
			super()			
			this.state = {
				loaded:'',movieDetails: [{active:"",banner_url:"",date_added:"",genre:"",language:"",notes:"",release_date:"",release_status:"",story:"",title:"",top_cast_for_list:"",trailer: "",movie_info:'{}'},{rating:""}],userRatingAvailable:'no',
			}	
		}
		GetMovieDetails = async(movieId)=> {
				const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/movies/'+movieId;
				const response = await fetch(URL)
				const listjson = await response.json();
				this.setState({	movieDetails:listjson})
		}

		_CheckRated=async(movieId='')=> {
				const useremail = await AsyncStorage.getItem('userToken')
				if(useremail) {
					const URL ='http://www.checknewwatch.com/iMovies/service/movies.json.php/users/000/ratingReview?email='+useremail+'&movie_id='+movieId;					
					const response = await fetch(URL)
					if(response.ok){var reviewData = await response.json();}}																	
						if((typeof(reviewData)!=='undefined') && reviewData.length>0){
							this.setState({ userRatingAvailable:Math.round(reviewData[0]['rating'])})
						}
					this.setState({	loaded:true })
				}
				componentDidMount(){
					const movieId = this.props.navigation.getParam('movieId');
					this.GetMovieDetails(movieId);
					this._CheckRated(movieId);					
				}

			    render() {
				  if(this.state.loaded==false){
				  	return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator size="large" color="#0099ff"  /></View>)
				  }
				  else {
				return (
					<ScrollView>{(this.state.movieDetails.title!='undefined')?
					<View><InfoSection infodata={this.state.movieDetails} navObj={this.props.navigation}/>							
					<RatingSection navObj={this.props.navigation}  RatingMovieInfo={this.state.movieDetails} store={store} movieId={this.props.navigation.getParam('movieId')} movieTitle={this.props.navigation.getParam('movieTitle')} userRatingAvailable={this.state.userRatingAvailable}/>
					<TitbitsSection titbits={this.state.movieDetails[0].notes}/></View>:<View style={{flex:1,alignItems:'center',justifyContent: 'center'}}><Text style={{alignItems:'center',justifyContent: 'center',marginTop:40}}>Please check your internet connection</Text></View>}
					  </ScrollView>
					);
				  }
			  }
  }

class HomeHeader extends Component {
    constructor () {
        super()
        this.state = {data:[],language:store.getState().dropVal}
        this.getLanguageList();
    }
    handleDropDownValueChange = (value)=> {
    	this.props.dispatcher(actionCreators.change(value))
    }

    getLanguageList = async()=> {
        const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/alllanguage'
        const response = await fetch(URL)
        const langlistJson = await response.json();
        this.setState({	data:langlistJson})
    }
    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    };

    helpPage = () => {
        this._menu.hide();
        this.props.navObj.navigate('HelpSection')
    };

    showMenu = () => {
        this._menu.show();
    };

    shareMenu = async() => {
        await this._menu.hide();
        Share.share({ message: 'Try out this awesome app to check new movie releases & ratings! https://play.google.com/store/apps/details?id=com.checknewwatch.android'});  //Note that according to the documentation at least one of "message" or "url" fields is required
    };

  render() {
      return (
          <View style={styles.nativeHeaderDropdownWr}>
              <View style={styles.nativeHeaderDropdown}>
                  <Picker selectedValue={this.state.language} onValueChange = {(value) => { this.handleDropDownValueChange(value), this.setState({language:value}) }} style={styles.picker}>
                      { this.state.data? (this.state.data).map(key=> <Picker.Item label={key} key={key} value = {key} />):'' }
                  </Picker>
              </View>
              <View style={styles.settinBtngWr}>
                  <Menu ref={this.setMenuRef} button={<TouchableHighlight onPress={this.showMenu} underlayColor='#4db8ff' style={styles.contextMenuIcon}><Icon name="md-more" size={25} color="#fff" /></TouchableHighlight>}>
                      <MenuItem onPress={this.helpPage}>Help</MenuItem>
                      <MenuItem onPress={this.shareMenu}>Share</MenuItem>
                  </Menu>
              </View>
          </View>
      )
  }
}

const RootStack = createStackNavigator({
		Home: {
    		screen: createMaterialTopTabNavigator({
							Released: {
									screen: Released,
									navigationOptions: ({ navigation }) => ({ title: 'Released' }),
							},
							Upcoming: {
									screen: Upcoming,
									navigationOptions: ({ navigation }) => ({ title: 'Upcoming' }),
							},
    				},
					{
					tabBarOptions: {
							  style: { backgroundColor: '#0099ff', padding: 0, marginBottom: -3 },
							  labelStyle: { fontWeight: '500', fontSize: 14 },
							  indicatorStyle: { borderWidth: 1.2, borderColor: '#fff'},
							  inactiveTintColor: '#ccebff',
					},
			}),
			navigationOptions: ({ navigation }) => ({
				  headerTitle: <HomeHeader navObj={navigation} dispatcher={store.dispatch}/>,
				  headerStyle: {
				  			backgroundColor:'#0099ff',
					  		shadowOffset: { height:0, width:0, elevation:0, shadowOpacity:0 },
					  		shadowRadius:0,
					  		shadowColor:'transparent',
					  		elevation:0,
					  		shadowOpacity:0,
					  		borderTopColor:'#007acc',
					  		borderTopWidth:24
				  },
			}),
    },
    Details: {
			screen: DetailsScreen,
			navigationOptions: ({ navigation }) => ({
					title: '',
					headerStyle: {  borderTopColor:'#007acc', borderTopWidth:24, backgroundColor:'#0099ff', height:80 },
					headerTitleStyle:{ marginBottom: 2, fontSize: 16, marginLeft: -6, paddingLeft: 6 },
					headerForceInset: { top: 'never' },
					headerTintColor: 'white',
			}),
    },
	movieInfoScreen: {
			screen: movieInfoScreen,
			navigationOptions: ({ navigation }) => ({
					headerTitle:<Text style={styles.aboutScreenHeader} ellipsizeMode='tail' numberOfLines={1}>{'About this movie'}</Text>,
					headerForceInset: { top: 'never' },
					headerStyle: { backgroundColor: '#fff',  borderTopColor: '#007acc', borderTopWidth: 24, height:80,  elevation: 0, shadowOpacity: 0, borderBottomColor: '#ccc', borderBottomWidth:1 },
					headerLeft:(<TouchableNativeFeedback onPress={() => {navigation.goBack(null)}} underlayColor="white" ><View style={styles.closeBtn}><Text><Icon name="md-close" size={25} color="#666" /></Text></View></TouchableNativeFeedback>),
			}),
	},
    HelpSection :{
          	screen: HelpSection,
          	navigationOptions: ({ navigation }) => ({
				  title: 'Help',
				  headerStyle: { borderTopColor: '#007acc', borderTopWidth: 24,backgroundColor: '#0099ff', height: 80 },
				  headerTitleStyle:{ marginBottom: 2,fontSize: 16, marginLeft: -6, paddingLeft: 6 },
				  headerForceInset: { top: 'never'},
				  headerTintColor: 'white',
          }),
    },
	LoginSection: {
			screen:createSwitchNavigator({
					AuthLoading: AuthLoadingScreen,
					App: createStackNavigator({
							RateReviewScreen:{
									screen:RateReviewScreen,
									navigationOptions:({navigation})=>({
											headerForceInset: {top: 'never'},
											headerTitle: <Text style={styles.rateScreenHeader} ellipsizeMode='tail' numberOfLines={1}>{'Rate '+navigation.getParam('movieTitle')}</Text>,
											headerStyle: { backgroundColor: '#0099ff', borderTopColor: '#007acc', borderTopWidth: 24, height:80 }
									})
							}
					}),
					Auth: createStackNavigator({ LoginScreen: LoginScreen }),
			}),
			navigationOptions: ({ navigation }) => ({ header: null })
	}
  },{
    initialRouteName: 'Home',
});

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  render() {
	return(
	    <Provider store={store} >
            <PersistGate persistor={persistor}>
                <AppContainer />
            </PersistGate>
        </Provider>
	)
  }
}

const styles = StyleSheet.create({
		listContainer : {
				backgroundColor: '#fafafa'
		},
		row: {
				padding: 1,
				marginBottom:1
		},
		cast: {
				color: '#404040',
				fontSize: 14
		},
		date: {
				color: '#404040',
				fontSize: 14,
				paddingTop: 1
		},
		genre: {
				marginLeft: 3,
				color: '#404040',
				fontSize: 14
		},
		column1 :{
				flexDirection: 'column',
				paddingRight: 10
		},
		column2 :{
				flexDirection: 'column',
				width: '65%'
	  	},
	   	column3 : {
			    flexDirection: 'row',
			    justifyContent: 'center',
			    alignItems: 'center'
	   	},
	    dategenreWr: {
				flexDirection: 'row'
		},
	  	rownew: {
			  	flexDirection: 'row',
			    marginTop: 10,
			    borderBottomColor: '#e8e8e8',
			    borderBottomWidth: 1,
			    borderStyle: 'solid',
			    paddingBottom: 10,
			    marginLeft: 15,
			    marginRight: 15,
	  	},
		title: {
			    flexDirection: 'row',
			    fontWeight: '500',
			    fontSize: 15
		},
		sectionheader: {
				paddingTop: 6,
				paddingBottom: 8,
				paddingLeft: 15,
				marginBottom: 5,
				backgroundColor: '#e6e6e6',
				color: '#4d4d4d',
				fontSize: 14
		},
		headerDropdown: {
				width: 105
		},
		nativeHeaderDropdown:{
			   flex: 1,
			   backgroundColor:'#008ae6',
			   width: 150,
			   justifyContent: 'center',
	    },
		nativeHeaderDropdownWr: {
				alignItems: 'center',
				flex: 1,
				justifyContent: 'center',
		},
		picker : {
				width: 150
		},
		border: {
				borderColor: 'transparent'
		},
		listRating:{
				color: '#fff',
				borderRadius: 15,
				height: 25,
				width: 25,
				fontSize: 12,
				paddingTop: 4.1,
				fontWeight: '900',
				textAlign: 'center',
		},
		listRatingLow: {
				backgroundColor:'#ff4d4d'
		},
		listRatingMedium: {
				backgroundColor: '#ffb200'
		},
		listRatingHigh: {
				backgroundColor: '#00b359'
		},
		movieListIcon: {
				borderRadius: 1,
				width: 66,
				height: 66
		},
		ActivityIndicatorWr: {
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
		},
		rateScreenHeader :{
			    fontSize: 18,
			  	color: '#fff',
			  	fontWeight: 'bold',
			  	marginBottom: 2
		},
		closeBtn :{
				paddingLeft: 20,
				paddingRight: 20,
				paddingTop: 20,
				paddingBottom: 20,
		},
		aboutScreenHeader: {
				fontSize: 18,
				color: '#666',
				fontWeight: 'bold',
				marginBottom: 2,
		},
		settinBtngWr :{
			  	position: 'absolute',
			  	right: 6,
		},
		contextMenuIcon :{
			    width: 32,
			    height:32,
			   	flex: 1,
			   	alignItems: 'center',
			  	justifyContent: 'center',
			  	borderRadius:30
		},
		languageinAll: {
			fontSize: 12,
			color:'#0099ff',
			marginBottom:-5
		}
})