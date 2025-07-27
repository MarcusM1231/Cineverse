import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useUser } from "@data/UserContext"

export default function AccountView() {
  const user = useUser()

  var PlaceHolderUsername = "";
  var PlaceHolderEmail = "";

  if(user){
    PlaceHolderUsername = user?.user!.username;
    PlaceHolderEmail = user?.user!.email;
  }
  

  const [username, setUsername] = useState(PlaceHolderUsername);
  const [email, setEmail] = useState(PlaceHolderEmail);
  const [editing, setEditing] = useState<EditType | null>(null); 
  const [tempValue, setTempValue] = useState('');

  type EditType = 'username' | 'email';

  const isButtonEnabled = (tempValue.length > 0 || tempValue.length > 0)

  const handleEditPress = (type: EditType) => {
    setTempValue(type === 'username' ? username : email);
    setEditing(type);
  };

  const handleSave = () => {
    if (editing === 'username') {
      setUsername(tempValue);
    } else if (editing === 'email') {
      setEmail(tempValue);
    }
    setEditing(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{username}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditPress('username')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditPress('email')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {/* Overlay */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!editing}
          onRequestClose={() => setEditing(null)}
        >
          <View style={styles.overlay}>
            <View style={styles.overlayContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEditing(null)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={tempValue}
                onChangeText={setTempValue}
                placeholder={editing === 'username' ? 'Enter new username' : 'Enter new email'}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !isButtonEnabled && { backgroundColor: '#333333' }
                ]}
              
                onPress={handleSave}
                disabled={!isButtonEnabled}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    color: 'white',
    fontSize: 16,
    flex: 2,
  },
  editButton: {
    backgroundColor: '#333333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#008080',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 1,
    right: 5,
  },
  closeButtonText: {
    color: '#FF6347',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 8,
    color: 'white',
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 10
  },
  saveButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
