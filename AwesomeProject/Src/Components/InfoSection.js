import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet,TouchableHighlight,ScrollView, Image,ImageBackground,NetInfo,ToastAndroid,Linking } from 'react-native'

export class InfoSection extends Component {
	youtubeApp=async()=>{
		ToastAndroid.showWithGravityAndOffset('Opening in youtube', ToastAndroid.SHORT, ToastAndroid.BOTTOM,0,40);	
		Linking.openURL(this.props.infodata[0].trailer)
	}
  render() {
	  	const {infodata}	= this.props
		const {movie_info} 	= infodata[0]
		const movieInfoObj 	= JSON.parse(movie_info)
		let top_cast_for_listAttr = infodata[0].top_cast_for_list.split(", ");		
		let genreAttr=infodata[0].genre.split(', ');
        return (
            <View>
            	<Text style={styles.InfoSectionTitle}>{infodata[0].title}</Text>				
            	<TouchableHighlight onPress={()=>{this.props.navObj.navigate('movieInfoScreen',{infodata:infodata})}} underlayColor='#e6e6e6'>
					<View style={styles.InfoSectionWr}>
                        {this.props.infodata[0].story.length==0?null:<View><Text style={styles.InfoSectionSynopsis} ellipsizeMode='tail' numberOfLines={3}>{infodata[0].story}</Text></View>}
						<View style={styles.thumbInfoWr}>
							<View style={styles.thumbImgWr}>
								{infodata[0].banner_url?<Image style={styles.thumbImg} source={{uri:infodata[0].banner_url}} />:null}
							</View>
							<View style={styles.InfoSectionShort}>
								<View>     
									{top_cast_for_listAttr.map((val,index)=>
										<View style={styles.topcastIterateWr} key={index}><Text style={styles.topcastIteratetxt}>{val}</Text></View>
									)}
								</View>
								<View style={styles.topgenreIterateWrMain}>
									{genreAttr.map((val,index)=>
										<View key={index}><Text style={styles.topgenreIteratetxt}>{val}</Text></View>
									)}
								</View>
								<View>
									<Text style={styles.inofsecText}>{infodata[0].release_date}</Text>
								</View>
							</View>
						</View>
						<View><Text style={styles.InfoReadMoreBtn}>{this.props.infodata[0].title.length>0?"VIEW ALL":null}</Text></View>
					</View>
            	</TouchableHighlight>{
					this.props.infodata[0].trailer?(<View style={styles.trailerMainWr}>
					<TouchableHighlight onPress={this.youtubeApp} >
						<View style={styles.trailerWr}>
							<Icon style={styles.trailerIcon} name="md-play-circle" size={40} color="#c4302b" />
							<Text style={styles.trailerText}>Watch trailer</Text>
						</View>
					</TouchableHighlight>
				</View>):null
				}
				
			</View>
				
		)
  }
}

export class movieInfoScreen extends Component {
    render() {
          const infodata		= this.props.navigation.state.params.infodata
          const {movie_info} 	= infodata[0]
          const movieInfoObj 	= JSON.parse(movie_info)
    return (
          <ScrollView>
              <View style={styles.movieInfoScreenWr}>
                <Text style={styles.MISTitles}>TOP CAST</Text>
                <View style={styles.MISphotosecWr}>
                    { movieInfoObj['all_actors'].map( key=>
                        <View key={key} style={styles.MISphotosecWrInner}>
                            <ImageBackground style={[styles.allActorsIcon]} key={key} source={{uri:`${movieInfoObj['all_actors_image_url']+key+'.jpg'}`}} defaultSource={require('../../Src/Images/googleBtn.png')} resizeMode="cover">
                                <Image style={{zIndex:-1}} key={key} source={require('../../Src/Images/person.jpg')} />
                            </ImageBackground>
                            <Text style={styles.castName} >{key}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.MISSynopsysWr}>
                    <Text style={styles.MISTitles}>SYNOPSYS</Text>
                    {infodata[0].story.length==0?<Text style={styles.MISEmpty}>No synopsys yet</Text>:<Text style={styles.MISInfoSectionSynopsis} >{infodata[0].story}</Text>}
                </View>
                <View style={styles.MISMovieInfo}>
                    <Text style={[styles.MISTitles,styles.MISMovieInfoTitle ]}>MOVIE INFO</Text>
                    {
                        delete movieInfoObj['Starring'], delete movieInfoObj['all_actors'],delete movieInfoObj['all_actors_image_url'],
                        Object.keys(movieInfoObj).map(key =>
                        <View style={styles.MISInfoRow} key={key}><Text style={styles.InfoLeft}>{key}</Text><Text style={styles.InfoRight}>{movieInfoObj[key]}</Text></View>
                    )}
                </View>
              </View>
          </ScrollView>
        );
  }
}

const styles = StyleSheet.create({
        movieInfoScreenWr :{
                marginLeft: 15,
                marginRight: 15,
                marginBottom: 50
        },
        MISphotosecWr :{
                flexWrap: 'wrap',
                flexDirection:'row',
                justifyContent: 'flex-start',
                marginBottom: 12
        },
        MISSynopsysWr :{
                borderColor: '#e6e6e6',
                borderTopWidth: 1,
                marginBottom: 15
        },
        MISMovieInfo :{
                borderColor: '#e6e6e6',
                borderTopWidth: 1,
        },
        InfoSectionWr: {
                marginLeft: 15,
                marginRight: 15,
        },
        InfoSectionTitle :{
                paddingLeft: 15,
                paddingRight: 15,
                fontSize: 18,
                fontWeight:'bold',
                paddingTop: 5,
                paddingBottom: 5,
                textAlign: 'center',
        },
        InfoSectionSynopsis :{
                color: '#4d4d4d',
                paddingBottom: 5,
				fontSize: 15
        },
        MISInfoSectionSynopsis :{
                paddingLeft: 15,
				fontSize: 15,
				color:'#4d4d4d'
        },
        InfoRow :{
                flexDirection: 'row',
                paddingTop: 4
        },
        InfoLeft: {
                width: '45%',
                paddingLeft: 15,
                color:'#4d4d4d',
                marginRight: 10,
				fontSize: 14
        },
        InfoRight: {
                color:'#4d4d4d',
                flex: 1,
                flexWrap: 'wrap',
                paddingLeft: 10,
				fontSize: 14
        },
        InfoReadMoreBtn :{
                color: '#0099ff',
                textAlign: 'center',
                marginTop: 17,
                marginBottom: 16,
                fontWeight: 'bold',
				fontSize: 16
        },
        MISphotosecWrInner :{
                marginLeft: 15,
                alignItems: 'center',
                borderRadius: 2,
                marginTop: 10,
        },
        allActorsIcon: {
                borderRadius: 1,
                width: 90,
                height: 90,
        },
        castName:{
                width: 90,
                fontSize: 14,
                padding: 3,
                textAlign: 'center',
                color:'#4d4d4d'
        },
        MISTitles:{
                fontSize: 15,
                fontWeight:'bold',
                marginTop: 10,
                marginBottom: 5,
                color: '#666'
            },
        MISMovieInfoTitle :{
                marginBottom: 12
        },
        MISInfoRow :{
                paddingTop: 7,
                flexDirection: 'row',
                backgroundColor: '#fafafa',
                borderBottomWidth: 1,
                borderColor: '#f0f0f0',
                paddingBottom: 7,
        },
        certificate :{
                borderRadius: 70,
                borderColor: '#e6e6e6',
                borderWidth: 1,
                width: 40,
                height: 20,
                textAlign:'center'
        },
        Infoseparator :{
                color: "#ccc",
                paddingLeft: 5,
                marginRight: 5,
        },
        inofsecText:{
                color: '#666',
				fontSize: 15
        },
        MISEmpty :{
                color: '#666',
                paddingLeft: 15
        },
        InfoSectionShort:{
				paddingTop: 5,
				paddingBottom: 3,
				marginLeft: 10,
                marginRight: 10,
				flexDirection: 'column',
				fontSize: 15
        },
		trailerText: {
			marginTop: -4,
			color: '#666',
		},
		thumbImgWr:{
			width: 150,
			height: 150,
			flexDirection: 'column',
		},
		thumbImg: {
			width: 150,
			height: 150,
		},
		thumbInfoWr: {
			flexDirection: 'row',
			marginTop: 8,
			marginBottom: 3
		},
		topcastIterateWr: {
			color: '#666',				
		},
		topgenreIterateWrMain :{
			paddingTop: 6,
			marginTop:7,
			paddingBottom: 7,
			marginBottom:7,
			color: '#4d4d4d',
			borderBottomWidth: 1,
            borderColor: '#f0f0f0',	
			borderTopWidth: 1	
		},
		topcastIteratetxt :{
			color: '#4d4d4d',		
			fontSize:15	,			
		},
		topgenreIteratetxt :{
			color: '#4d4d4d',
			fontSize:15				
		},
		trailerMainWr:{
			alignItems: 'center',
			paddingBottom: 10,		
			borderColor: '#e6e6e6',
            borderTopWidth: 1,		
			paddingTop:10			,
			marginLeft: 15,
			marginRight: 15
		},
		trailerWr:{
			alignItems: 'center',	
		}
		
		
})