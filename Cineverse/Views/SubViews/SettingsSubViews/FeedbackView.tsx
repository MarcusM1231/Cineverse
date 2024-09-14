import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';

const AccentColor = '#013b3b';

export default function FeedbackView() {
  const [feedback, setFeedback] = useState('');

  const handleSendFeedback = () => {
    console.log('Feedback sent:', feedback);
    setFeedback('');
  };

  const isButtonDisabled = feedback.replace(/\s/g, '').length < 5;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>
          We are committed to continuously enhancing our app and welcome suggestions or new feature ideas from our community.
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type your feedback here..."
          placeholderTextColor="#888"
          value={feedback}
          onChangeText={setFeedback}
          multiline={true}
          scrollEnabled={true}
        />

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleSendFeedback}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonTitle}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: AccentColor,
    width: "80%",
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#333333',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  textInput: {
    width: '100%',
    height: 150,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: 'white',
    textAlignVertical: 'top',
    backgroundColor: '#1e1e1e',
  },
  text: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center'
  }
});
