import { StatusBar } from 'expo-status-bar';
import { DeviceMotion } from 'expo-sensors';
import {useState, useEffect} from 'react'
import React from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';


export default function App() {

  let x_list = []; 
  let y_list = []; 
  let z_list = []; 

  let [activityStatus, setActivityStatus] = useState("sitting")

  _subscribe = () => {
    DeviceMotion.addalListener((data) => {
      let acc = data.acceleration; 
      x_list.push(acc.x); 
      y_list.push(acc.y); 
      z_list.push(acc.z); 

      if (x_list.length == 50){
        //http://10.0.0.168:5000/

        fetch('http://10.0.0.168:3000/activityrec', {
          method: 'POST', 
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([x_list, y_list, z_list]),

        }).then((res) => {
          res.json().then((data) => {
            console.log(data['data'])
            setActivityStatus(data['data'])
          })


        })


        x_list = []
        y_list = []
        z_list = []
        
      }

    })
    DeviceMotion.setUpdateInterval(15); 
  }

  _unsubscribe = () => {
    DeviceMotion.removeAllListeners(); 
  }

  useEffect(() => {
    _subscribe(); 
    return () => {
      _unsubscribe(); 
    }
  })

  return (
    <View style={styles.container}>
      <Text>Extracting Accelerometer Data</Text>
      <Text>Status: {activityStatus}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
