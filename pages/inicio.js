import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Button, Text } from 'react-native';

import * as Notifications from 'expo-notifications'
import storage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react';

import msgs from '../utils/notifContent'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

export default function InicioScreen({ navigation }) {
  const [notification, setNotification] = useState(false)
  const [enviarNovaNotif, setEnviarNovaNotif] = useState(false)
  const [textoTela, setTextoTela] = useState(false)
  const notificationListener = useRef('')
  const responseListener = useRef()

  function pegarMensagem() {
    const index = Math.floor(Math.random() * msgs.length)
    const msg = msgs[index]

    return msg
  }

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
        const data = lastNotificationResponse.notification.request.content
        navigation.navigate('FinalScreen', {
            title: data.title,
            content: data.body
        })
      
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    setTimeout(async () => {
      const msg = pegarMensagem()

      await Notifications.scheduleNotificationAsync({
        content: {
          title: msg.title,
          body: msg.body,
        },
        trigger: { seconds: 1 }
      })

      setEnviarNovaNotif(!enviarNovaNotif)
    }, 1000 * 60 * 5) // 5 segundos
  }, [enviarNovaNotif])

  useEffect(() => {
    const pegarPermissoes = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if(existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if(finalStatus !== 'granted') {
        alert('Permita as notificações!')

        await storage.setItem('expopushtoken', '')

        return
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data
      await storage.setItem('expopushtoken', token)
  
      if(Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C'
        })
      }
    }

    pegarPermissoes()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {})

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }

  }, [])

  const onClick = async () => {
    const msg = pegarMensagem()

    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        data: { data: 'data vai aqui' }
      },
      trigger: { seconds: 1 }
    })

    setTextoTela(true)
  }

  return (
    <View style={styles.container}>
      <Button onPress={onClick} title='Testar notificações' />
      { textoTela && <Text>Notificação enviada. aguarde</Text> }
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
