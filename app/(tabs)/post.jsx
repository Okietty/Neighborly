import RNDateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { app } from '../../firebaseConfig';

export default function Post() {
  const db = getFirestore(app);
  const [categoryList, setCategoryList]=useState([]);
  const [image, setImage] = useState(null);
  const storage = getStorage();
  const [loading,setLoading]=useState(false);
  // Date and Time variables
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');

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

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
     setShow(Platform.IOS === 'ios');
     setDate(selectedDate);

    let tempDate = new Date(currentDate);
    let fDate = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
    let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();

    console.log(fDate + ' (' + fTime + ')')
  }

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
          Alert.alert('Success!!', 'Post added Succesfully.');
        }
      })
    });
  }

  return (
      <View style={{ flex: 1, justifyContent:'center', backgroundColor: "white", padding:10}}>
          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", marginTop:40, marginBottom: 40 }}>
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
            {({handleChange,handleBlur,handleSubmit,setFieldValue,resetForm,values,errors})=>(
              <View>
                
                <TouchableOpacity onPress={pickImage} style={{marginTop:8,marginBottom:4}}>
                  {image?
                  <Image source={{uri:image}} style={{width:140,height:140,borderRadius:15}}/>
                  :
                  <Image source={require('./../../assets/images/imageplaceholder.jpeg')}
                  style={{width:140,height:140,borderRadius:15}}
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
                  //numberOfLines={5}
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
                <View style={style.dropdown}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select a Category',
                        value: "",
                        color: '#9EA0A4',
                      }}
                      
                      items={categoryList.map(item => ({
                        label: item.type,
                        value: item.type,
                        color: '#000',
                      }))}
                      value={values.category}
                      onValueChange={(value) => setFieldValue('category', value)}

                      style={{ 
                        inputIOSContainer:{
                          width: '100%', height: 40, borderRadius:10, color:'white', padding:10, zIndex:100
                        }
                      }}
                    />
                </View>

                <View style={style.date}>
                  <Text style={{color: '#9EA0A4', marginTop:4, marginBottom:8, marginLeft:10}}>
                    CHOOSE LISTING DURATION
                  </Text>
                  <View style={{flexDirection:'row'}}>
                    <RNDateTimePicker 
                      style={{marginRight:8}} 
                      value={date} 
                      mode='date' 
                      //display='compact'
                      onChange={onChangeDate} 
                    />
                    
                    <RNDateTimePicker 
                      style={{marginLeft:8}} 
                      value={date} 
                      mode='time' 
                      //display='compact'
                      onChange={onChangeDate} 
                    /> 
                </View>
                </View>
                
                <View style={{flexDirection: "row"}}>
                  <TouchableOpacity onPress={()=>{resetForm(); setImage(null); setDate(new Date)}}
                  style={[style.button, {backgroundColor:loading?'#ccc':'#E6E6E6'}]} disable={loading}>
                    {loading?
                      <ActivityIndicator color={'#fff'}/>
                      :
                      <Text style={{color:'black', textAlign:'center', fontSize:16, margin:10}}>Cancel</Text>
                    }
                </TouchableOpacity>

                  <TouchableOpacity onPress={handleSubmit} 
                  style={[style.button, {backgroundColor:loading?'#ccc':'#2C2C2C'}]} disable={loading}>
                    {loading?
                      <ActivityIndicator color={'#fff'}/>
                      :
                      <Text style={{color:'white', textAlign:'center', fontSize:16, margin:10}}>Post</Text>
                    }
                </TouchableOpacity>
                {/* <Button onPress={handleSubmit} 
                style={{marginBottom:7}}
                title="submit" /> */}
                </View>
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
    borderRadius:2,
    marginTop:8,
    marginBottom:8,
    padding:12,
    paddingHorizontal:17,
    backgroundColor: '#dad8d8',
    borderColor: "#ccc",
  },

  dropdown: {
    borderWidth:2,
    borderColor: "#ccc",
    borderRadius:10,
    marginTop:8,
    marginBottom:8
  },
  
  button: {
    flex:1,
    padding:4, 
    height: 50, 
    borderRadius:10, 
    margin:4,
    marginTop:10,
    marginBottom: 12
  },

  date: {
    color:'black',
    borderBottomWidth:1,
    borderRadius:2,
    marginTop:8,
    marginBottom:8,
    padding:12,
    paddingHorizontal:17,
    backgroundColor: '#dad8d8',
    borderColor: "#ccc",
  }
})