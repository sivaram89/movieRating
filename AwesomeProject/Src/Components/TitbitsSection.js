import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export class TitbitsSection extends Component {
      render() {
              let TitbitsArrt = this.props.titbits.split(",,");
              getRandomColor = ()=> {
                      var letters = '0123456789ABCDEF';
                      var color = '#';
                      for (var i = 0; i < 6; i++) {
                          color += letters[Math.floor(Math.random() * 16)];
                      }
                      return color;
              }

              return (
                      <View style={styles.TitbitsWr}>
                            <Text style={styles.TitbitsSectionTitle}>Titbits</Text>
                            <View>
                                {
                                    this.props.titbits.length==0?(<Text style={styles.TitbitsEmpty}>No titbits yet</Text>):(TitbitsArrt.map((val,index)=>
                                        <View key={index} style={styles.titbitRow}><Text style={[styles.bulletWr,{color:getRandomColor()}]}> &#9632;</Text><Text style={styles.TitbitsContent}>{val}</Text></View>
                                    ))
                                }
                            </View>
                      </View>

                )
      }
}

const styles= StyleSheet.create({
    TitbitsWr :{
            borderColor: '#e6e6e6',
            borderTopWidth: 1,
            marginLeft: 15,
            marginRight: 18,
            paddingBottom: 25
	},
    TitbitsSectionTitle :{
            color: '#1a1a1a',
            fontSize: 16,
            fontWeight:'bold',
            marginTop: 8,
            marginBottom: 4
	},
    TitbitsContent :{
            color:'#4d4d4d',
			fontSize: 15,
			paddingRight: 18
    },
    TitbitsEmpty :{
            color: '#666'
    },
    titbitRow :{
            flexDirection: 'row',
            marginBottom: 8,
			paddingRight:5
    },
    bulletWr :{
            paddingRight: 10,
            color: '#0099ff',
            fontSize: 10,
            paddingTop: 2
    }
})