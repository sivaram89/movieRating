import React, { Component } from 'react'
import { View, Text,Button,TouchableHighlight,TouchableNativeFeedback,StyleSheet, ActivityIndicator, AsyncStorage, ScrollView, Image,ToastAndroid,NetInfo } from 'react-native'
import StarRating from 'react-native-star-rating'
import { Google } from 'expo';
import { reducer,actionCreators } from '../MovieReducer'
import Icon from 'react-native-vector-icons/Ionicons'

export class RatingSection extends Component {
        _isMounted = false;
         constructor (props) {
                super(props)
                this.state = { count: 0,isConnected: true }
         }
        componentWillUnmount(){
                this._isMounted = false;
				NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange); // Netinfo
        }
        componentDidMount() {
                this._setMovieData()
                this._isMounted = true;
                let currentValue
                receiveRatedVal=()=>{
                        let previousValue = currentValue
                        currentValue = this.props.store.getState().ratedVal
                        if (previousValue !== currentValue) {
                                if(this._isMounted) {
                                    this.setState({count: currentValue});
                                }
                                return true;
                        }
                }
                const unsubscribe = this.props.store.subscribe(receiveRatedVal)
				NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);  // Netinfo
            }
			
		handleConnectivityChange = isConnected => {
			  this.setState({isConnected:isConnected });
		};
		  
		_setMovieData=async()=> {
                await AsyncStorage.setItem('movieId', this.props.movieId)
                await AsyncStorage.setItem('movieTitle', this.props.movieTitle)
		}
		_editClick(){
				if (!this.state.isConnected) {
					this.showNoInternet();
				}
				else {
					this.props.navObj.navigate('RateReviewScreen',{movieTitle:this.props.movieTitle,store:this.props.store})
				}				
		}
		
		_ratebtnClick(){
				if (!this.state.isConnected) {
					this.showNoInternet();
				}
				else {
					this.props.navObj.navigate('LoginSection', {movieId:this.props.movieId, movieTitle:this.props.movieTitle, store:this.props.store})
				}	    
		}
		
		showNoInternet(){
			ToastAndroid.showWithGravityAndOffset('Please check your internet connection.', ToastAndroid.SHORT, ToastAndroid.BOTTOM,0,40);			
		}
		
  render() { 
		return (
		    <View>{(new Date(this.props.RatingMovieInfo[0].release_date)<=new Date())?
                (<View key={this.state.count} style={styles.RatingSectionWr}>
                    <View />
                    <Text style={styles.RatingSectionTitle}>Rating</Text>
                    <View style={styles.RatingSectionContentWr}>
                        {this.props.RatingMovieInfo[1].rating==null?<Text style={styles.ratingsEmpty}>No ratings yet</Text>:(<View style={styles.RatingContent1Wr}><Text style={styles.RatingContent1}>{parseFloat(this.props.RatingMovieInfo[1].rating)}</Text>
                            <Text style={styles.RatingContentIcon}><Icon name="md-star" size={30} color="#feba1b" /></Text></View>)}

                        {this.props.RatingMovieInfo[1].rating==null?null:(<View style={styles.RatingContent2Wr}><Text style={styles.RatingContent2}>{
						this.props.RatingMovieInfo[1].totalrating > 999 ? ((this.props.RatingMovieInfo[1].totalrating/1000).toFixed(1)) + 'K' : this.props.RatingMovieInfo[1].totalrating} <Icon name="md-person" size={13} color="#333" /></Text></View>)}

                        {this.state.count>0? (<View style={styles.yourRatingWr}><TouchableHighlight onPress={()=>{this._editClick()}} underlayColor='#e6e6e6'><View>
                            <Text style={styles.yourRatingText}>Your rating {this.state.count} <Icon name="md-create" size={13} color="#666" /></Text></View></TouchableHighlight></View>):
                            (this.props.userRatingAvailable=='no'?
                                <TouchableHighlight underlayColor='#e6e6e6' onPress={()=>{this._ratebtnClick()}}>
                                    <View style={styles.ratethisbtnWr}><Text style={styles.ratethisbtn}>Rate this movie </Text><Text style={styles.ratethisbtnIcon}> <Icon name="md-star-outline" size={20} color="#0099ff" /></Text></View>
                                </TouchableHighlight> :<View style={styles.yourRatingWr}><TouchableHighlight underlayColor='#e6e6e6' onPress={()=>{this._editClick()}} underlayColor='#e6e6e6'>
                                    <View><Text style={styles.yourRatingText}>Your rating {this.props.userRatingAvailable} <Icon name="md-create" size={13} color="#666" /></Text></View></TouchableHighlight></View>) }
                    </View>
                </View>):null}
            </View>
		)
  }
}


export class LoginScreen extends Component {
        state = {
                logincall1:false,
                logincall2: false,
                logincall3:false,
        }
	    static navigationOptions = {
		        header: null
	    };
	   render() {
              if(this.state.logincall1==false){
                      return (
                          <View style={styles.LoginScreenWr}>
                              <TouchableHighlight onPress={this._GoogleSignInAsync} underlayColor='#5793f4'>
                                  <View style={styles.googleBtnWr}>
                                      <View>
                                          <Image source={require('../Images/googleBtn.png')}/>
                                      </View>
                                      <View style={styles.googleTextBtnWr}>
                                          <Text style={styles.googleTextBtn}>Continue with Google</Text>
                                      </View>
                                  </View>
                              </TouchableHighlight>
                          </View>
                      );
              }
              else if(this.state.logincall1==true && this.state.logincall2==false){
                    return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator size="large" color="#0099ff" /></View>)
              }
              else if(this.state.logincall1==true && this.state.logincall3==false){
                    return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator size="large" color="#0099ff" /></View>)
              }
              else {
                    return true
              }
	  }
	  _GoogleSignInAsync=async ()=> {
              try {				  
                    this.setState({logincall1:true})
					const clientId = '143895539178-39d9q8ivqf2et2pfefqoqskd239fse05.apps.googleusercontent.com';
					const { type, accessToken, user } = await Google.logInAsync({ clientId });
                    this.setState({logincall2:true})
                    if(type === 'success') {         //Save user
                            const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/users'
                            const response = await fetch(URL, { method:"POST",headers:{"Content-Type": "application/json"}, body:JSON.stringify({email:user.email,fullname:user.name,
                                    givenname:user.givenName, last_name:user.familyName}) })
                            const resultData = await response.json();
                            this.setState({logincall3:true})
                            if(resultData.UserCreationStatus=='UserCreated') {
                                    await AsyncStorage.setItem('userToken', user.email);
                                    const movieTitle = await AsyncStorage.getItem('movieTitle');
                                    this.props.navigation.navigate('RateReviewScreen',{movieTitle:movieTitle,store:this.props.navigation.getParam('store')});
                            }
                            return accessToken;
                    } else {
                            return {cancelled: true};
                    }
              }
              catch(e) {
                 return {error: true};
              }
      }
}

export class RateReviewScreen extends Component {
	    constructor () {
                super()
                this.state = {
                        starCount:0,
                        movieId:'',
                        movieTitle:'',
                        AsynchDone:0
                }
                this._getMovieData()
        }

        _getMovieData=async()=>{
                const movieId = await AsyncStorage.getItem('movieId')
                this.setState({movieId})
                const movieTitle = await AsyncStorage.getItem('movieTitle')
                this.setState({movieTitle})
        }
	
        componentDidMount(){
                this._getExistingReview()
        }
	    _getExistingReview=async()=>{
                try {
                        const useremail = await AsyncStorage.getItem('userToken')
                        const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/users/000/ratingReview?email='+useremail+'&movie_id='+this.state.movieId
                        const response = await fetch(URL)
                        const reviewData = await response.json();
                        if((typeof(reviewData)!=='undefined') && reviewData.length>0){
                                this.setState({ starCount:parseInt(reviewData[0]['rating'])})
                        }
                        this.setState({AsynchDone:1})
                } catch(e) {
                        return {error: true};
                }
	    }

        static navigationOptions = ({ navigation }) => {
                 return {
                         headerLeft:(<TouchableNativeFeedback onPress={() => {navigation.goBack(null)}} underlayColor="white" >
                                    <View style={styles.closeBtn}>
                                    <Text><Icon name="md-close" size={25} color="#fff" /></Text>
                                    </View></TouchableNativeFeedback>)
                 }
        };
        render() {
                if(this.state.AsynchDone==0){
                        return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator size="large" color="#0099ff" /></View>)
                }
		        else {
                        return (
                            <View style={styles.rateScreenWr}>
                                <View style={styles.StarComponentWr}>
                                    <View>
                                        <StarRating disabled={false} emptyStar={'ios-star-outline'} fullStar={'ios-star'} halfStar={'ios-star-half'} iconSet={'Ionicons'} maxStars={5}rating={this.state.starCount}
                                                    selectedStar={(rating) => this.onStarRatingPress(rating)} fullStarColor={'#0099ff'} />
                                    </View>
                                </View>
                                <View style={styles.ratinghelptextWr}>
                                    <Text style={styles.ratinghelptext}>Worst</Text><Text style={styles.ratinghelptext}>Bad</Text><Text style={styles.ratinghelptext}>Ok</Text><Text style={styles.ratinghelptext}>Good</Text>
                                    <Text style={styles.ratinghelptext}>Awesome</Text>
                                </View>
                                <View style={styles.rateScreenIndicator}><Text>Your rating: {this.state.starCount}/5</Text></View>
                                <View style={styles.submitBtnWr}>
                                    <TouchableNativeFeedback onPress={this._onPressSubmitReviewButton} underlayColor="white" disabled={this.state.starCount>0?false:true} >
                                        <View style={[styles.submitBtnInner,{backgroundColor:this.state.starCount>0?'#2196f3':'#989898'}]}>
                                            <Text style={styles.buttonText}>SUBMIT</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>                                
                            </View>
                        );
                }
        }

        onStarRatingPress(rating) {
                this.setState({ starCount: rating });
        }
	
        _onPressSubmitReviewButton = async()=> {
                const movieId= await AsyncStorage.getItem('movieId')
                const user= await AsyncStorage.getItem('userToken')
                ToastAndroid.showWithGravityAndOffset('Rated. Thank you!', ToastAndroid.SHORT, ToastAndroid.BOTTOM,0,20);

                this.handleRatedValChange()

                try {
                        const URL = 'http://www.checknewwatch.com/iMovies/service/movies.json.php/movies/'+movieId+'/ratingReview'
                        const response = await fetch(URL, { method:"POST",headers:{"Content-Type": "application/json"}, body:JSON.stringify({rating:this.state.starCount, title_val:' ',movie_id:movieId, email:user}) })
                        const resultData = await response.json();
                        if(resultData.reviewCreationStatus=='ReviewSuccessful') {
                                const movieTitle = await AsyncStorage.getItem('movieTitle')
                                this.props.navigation.goBack(null);
                        }
                }
                catch(e){
                        return {error: true};
                }

        }
        handleRatedValChange = ()=> {
                ratedVal=this.state.starCount
                this.props.navigation.state.params.store.dispatch(actionCreators.ratedCount(ratedVal))
        }

        //_signOutAsync = async () => {
                //await AsyncStorage.removeItem('userToken');
                //this.props.navigation.navigate('LoginScreen');
        //};
}

export class AuthLoadingScreen extends React.Component {
        constructor() {
                super();
                this._bootstrapAsync();
        }

        _bootstrapAsync = async () => {
                const userToken = await AsyncStorage.getItem('userToken');
                userTonkenCheck=userToken ? 'RateReviewScreen' : 'LoginScreen' /*Hard coded RateReviewScreen 05-02-2019 as no other way found to pass store or paramas, tried redux here, above line maybe rewritten*/
                this.props.navigation.navigate(userTonkenCheck,{movieTitle:this.props.navigation.getParam('movieTitle'), store:this.props.navigation.getParam('store')});
        };
        render() {
                return (<View style={styles.ActivityIndicatorWr}><ActivityIndicator color="#0099ff" size="large"/></View>);
        }
}

const styles = StyleSheet.create({
        ActivityIndicatorWr: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
        },
        LoginScreenWr:{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
        },
        StarComponentWr: {
                paddingRight: '10%',
                paddingLeft: '10%',
                marginTop: '5%',
        },
        ratinghelptextWr: {
                flexDirection :'row',
                paddingRight: '5%',
                paddingLeft: '5%',
                justifyContent: 'center',
                marginBottom: 30
        },
        ratinghelptext: {
                height: 20,
                width: '20%',
                textAlign: 'center',
                justifyContent: 'center',
                color:'#999'
        },
        rateScreenIndicator:{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                bottom: '25%',
                left: 0,
                right: 0
        },
        buttonText: {
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
        },
        submitBtnWr: {
                position:'absolute',
                bottom: 0,
                left: 0,
                right: 0
        },
        submitBtnInner :{
                paddingTop: 10,
                paddingBottom: 12,
        },
        RatingSectionWr :{
                marginLeft: 15,
                marginRight: 15,
                borderColor: '#e6e6e6',
                borderTopWidth: 1,
        },
        RatingSectionTitle :{
                fontWeight:'bold',
                color: '#1a1a1a',
                fontSize: 16,
                marginTop: 6,
        },
        RatingSectionContentWr:{
                alignItems: 'center',
                justifyContent: 'center',
        },
        RatingContent1Wr:{
                flexDirection: 'row',
                marginTop: -15
        },
        RatingContent1 :{
                fontSize: 50,
                fontWeight:'400',
                color: '#1a1a1a',
        },
        RatingContent2Wr :{
                marginBottom: 10,
                marginTop: -10
        },
        RatingContent2 :{
                color: '#1a1a1a'
        },
        RatingContentIcon : {
                marginTop: 18,
                marginLeft: 5
        },
        yourRatingWr:{
                alignItems: 'flex-start',
                flexDirection:'row',
                marginBottom: 3
        },
        ratethisbtnWr: {
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 6,
                paddingBottom: 7,
                marginTop: -2,
                marginBottom: 6,
                flexDirection:'row',
        },
        ratethisbtn :{
                color: '#0099ff',
				fontSize: 15
        },
        ratethisbtnIcon:{
                color: '#fff'
        },
        googleBtnWr:{
                flexDirection:'row'
        },
        googleTextBtnWr :{
                paddingRight: 30,
                paddingLeft: 10,
                paddingTop: 9,
                backgroundColor:'#4285f4',
        },
        googleTextBtn :{
                color: '#fff',
                fontSize: 15
        },
        yourRatingText :{
                color: '#666',
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop:8,
                paddingBottom: 8,
                marginTop: -4,
        },
        closeBtn :{
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 20,
        },
        rateScreenWr :{
                flex:1,
                justifyContent: 'center',
        },
        ratingsEmpty :{
                marginBottom: 10,
                color: '#666'
        }
});