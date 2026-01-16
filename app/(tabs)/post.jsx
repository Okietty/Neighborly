import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { app } from '../../firebaseConfig';

export default function Post() {
  const db = getFirestore(app);
  const [categoryList, setCategoryList]=useState([]);
  const [image, setImage] = useState(null);
  const storage = getStorage();
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
      getCategoryList();
  },[])

  // Used to get Category List
  const getCategoryList=async()=>{
      const querySnapshot = await getDocs(collection(db, 'Category'));

      querySnapshot.forEach((doc)=>{
          console.log("Docs:", doc.data());
          setCategoryList(categoryList=>[...categoryList, doc.data()])
      })
  }

  // Use to Pick Image from Gallery
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod=async(value)=>{
    //value.image=image;
    //console.log(value)

    setLoading(true);
    //Conver Uri to Blob File
    const resp=await fetch(image);
    const blob=await resp.blob();
    const storageRef = ref(storage, 'communityPost/'+Date.now()+".jpg");

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    }).then((resp)=>{
      getDownloadURL(storageRef).then(async(downloadUrl)=>{
        console.log(downloadUrl);
        value.image=downloadUrl;

        const docRef=await addDoc(collection(db,"UserPost"), value)
        if(docRef.id){
          setLoading(false);
          //console.log("Document Added!!")
          Alert.alert('Success!!!', 'Post added Succesfully.');
        }
      })
    });
  }

  return (
      <View style={{ flex: 1, justifyContent:'center', backgroundColor: "white", padding:10}}>
          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", marginBottom: 40 }}>
            Post a New Listing
          </Text>

          <Formik
            initialValues={{label:'',desc:'',category:'',price:'',image:''}}
            onSubmit={value=>onSubmitMethod(value)}
            validate={(values)=>{
              const errors={}
              if(!values.label)
              {
                console.log("Label not Present")
                errors.name="Label Must be there"
              }
              return errors
            }}
          >
            {({handleChange,handleBlur,handleSubmit,setFieldValue,values,errors})=>(
              <View>
                
                <TouchableOpacity onPress={pickImage}>
                  {image?
                  <Image source={{uri:image}} style={{width:120,height:120,borderRadius:15}}/>
                  :
                  <Image source={require('./../../assets/images/imageplaceholder.jpeg')}
                  style={{width:120,height:120,borderRadius:15}}
                  />
                  }
                  
                </TouchableOpacity>
                
                <TextInput
                  style={style.input}
                  placeholder='Label'
                  placeholderTextColor='#a8a8a8'
                  value={values?.label}
                  onChangeText={handleChange('label')}
                />

                <TextInput
                  style={[style.input, { height: 150, textAlignVertical: 'top' }]}
                  placeholder='Description'
                  placeholderTextColor='#a8a8a8'
                  value={values?.desc}
                  multiline
                  numberOfLines={5}
                  onChangeText={handleChange('desc')}
                />

                <TextInput
                  style={style.input}
                  placeholder='Price'
                  placeholderTextColor='#a8a8a8'
                  value={values?.price}
                  keyboardType='number-pad'
                  onChangeText={handleChange('price')}
                />

                {/* Category List Dropdown */}
                <View style={{borderWidth:3,borderColor: "#ccc",borderRadius:10,marginTop:15}}>
                  <Picker
                    style={{ width: '100%', height: 200, color:'white'}}
                    selectedValue={values?.category}
                    onValueChange={(itemValue) => setFieldValue("category", itemValue)}
                  >
                    <Picker.Item label="Select a category" value="" color='#000'/>
                    {categoryList.map((item,index)=>(
                      <Picker.Item key={index}
                      label={item?.type} value={item?.type} color='#000'/>
                    ))}
                  </Picker>
                </View>

                <View style={{borderWidth:3,borderColor: "#ccc",borderRadius:10,marginTop:15}}>
                 
                </View>
                
                <TouchableOpacity onPress={handleSubmit} 
                  style={{padding:4, height: 50, backgroundColor:loading?'#ccc':'#147aee', borderRadius:20, marginTop:10}} disable={loading}>
                    {loading?
                      <ActivityIndicator color={'#fff'}/>
                      :
                      <Text style={{color:'white', textAlign:'center', fontSize:16, margin:10}}>Submit</Text>
                    }
                </TouchableOpacity>
                {/* <Button onPress={handleSubmit} 
                style={{marginBottom:7}}
                title="submit" /> */}
              </View>
            )}
          </Formik>
      </View>
  )
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },

  input: {
    color:'black',
    borderBottomWidth:1,
    borderRadius:10,
    marginTop:10,
    marginBottom:12,
    padding:12,
    paddingHorizontal:17,
    backgroundColor: '#dad8d8',
    borderColor: "#ccc",

  },

  inputStyle: {
    flex: 1,
    color: 'black',
    backgroundColor: '#dad8d8',
    borderWidth: 1,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#5f5d5d",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12
  },

  button: {
    flex:1, 
    alignItems: "center", 
    color: 'black',
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 12,
    borderRadius: 4,
    margin: 2,
    marginBottom: 12
  }
})