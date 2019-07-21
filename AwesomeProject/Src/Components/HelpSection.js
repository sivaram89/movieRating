import React, {Component} from "react";
import {View, Text, StyleSheet, Linking, TouchableHighlight, AsyncStorage, ToastAndroid} from 'react-native'

export class HelpSection extends Component
{
    state={
        signedOut:false
    }
    componentDidMount() {
        this.checkSignout()
    }
    checkSignout = async () =>{
        const userSigned=await AsyncStorage.getItem('userToken')
        if(userSigned==null){
            this.setState({signedOut:true})
        }
	}
    _signOutAsync = async () => {
        await AsyncStorage.removeItem('userToken');
        ToastAndroid.showWithGravityAndOffset('Signed out!', ToastAndroid.SHORT, ToastAndroid.BOTTOM,0,20);
        this.setState({signedOut:true})
    };
	mailMenu=async()=>{
		Linking.openURL('mailto:support@checknewwatch.in?subject=App Feedback&body=Hello Checknewwatch,  ')
	}
	
    render(){
        return (
            <View style={styles.helpSectionWr}>
                <View style={styles.contactUsWr}>
                    <Text style={styles.titleTxt}>Contact us</Text>
                    <TouchableHighlight onPress={this.mailMenu}  underlayColor='#f2f2f2'>
                        <Text style={styles.contentTxt}>Email Suggestions & Feedback</Text></TouchableHighlight>
                </View>
                <View style={styles.RateUsWr}>
                    <Text style={styles.titleTxt}>Rate us</Text>
                    <TouchableHighlight onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.checknewwatch.android')}  underlayColor='#f2f2f2'>
                        <Text style={styles.contentTxt}>Rate us at Google Play</Text></TouchableHighlight>
                </View>
				<View style={styles.privacyWr}>
                    <TouchableHighlight onPress={() => Linking.openURL('http://www.checknewwatch.com/privacy_policy.html')}  underlayColor='#f2f2f2'>
                        <Text style={styles.contentTxt}>Privacy policy</Text></TouchableHighlight>
                </View>
                {
                    this.state.signedOut==true?null: <TouchableHighlight onPress={this._signOutAsync}  underlayColor='#f2f2f2' style={styles.signOut}>
                        <Text style={styles.signTxt}>Sign out</Text></TouchableHighlight>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
        helpSectionWr :{
                flex:1
        },
        contactUsWr :{
                borderColor: '#e6e6e6',
                borderBottomWidth: 1,
                paddingTop: 20,
                paddingBottom: 10
        },
        RateUsWr :{
                paddingTop: 20
        },
        titleTxt :{
                fontSize: 22,
                color: '#666',
                paddingLeft: 20,
        },
        contentTxt :{
                fontSize: 15,
                color: '#666',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 21,
                color: '#0099ff'
        },
        signOut:{
                position:'absolute',
                bottom: 20,
                left: 20
        },
        signTxt :{
                color: '#0099ff'
        },
        signedTxt :{
                color: '#666'
        },
		privacyWr:{
                position:'absolute',
                bottom: 50,
                left: 20			
		}
})