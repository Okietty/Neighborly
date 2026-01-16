import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Post() {
  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "white", padding: 16 }}>
      <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Post a New Listing
      </Text>

      <View style={style.container}>
        <TextInput
          placeholder="Item Label"
          placeholderTextColor='#a8a8a8'
          style={style.inputStyle}
        />
      </View>

      <View style={style.container}>
        <TextInput
          placeholder="Price"
          placeholderTextColor='#a8a8a8'
          keyboardType="numeric"
          style={style.inputStyle}
        />
      </View>
      

      <View style={style.container}>
        <TextInput
          placeholder="Category"
          placeholderTextColor='#a8a8a8'
          style={style.inputStyle}
        />
      </View>
      

      <View style={style.container}>
        <TextInput
          placeholder="Description"
          placeholderTextColor='#a8a8a8'
          multiline
          numberOfLines={4}
          style={[style.inputStyle, { height: 200, textAlignVertical: "top" }]}
        />
      </View>
      
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity onPress={()=> 
          console.log("Pressed!")} 
          style={style.button}>
          <Text>
            Cancel
          </Text>
        </TouchableOpacity>
        

        <TouchableOpacity onPress={()=> 
          console.log("Pressed!")} 
          style={[style.button, {backgroundColor: '#2C2C2C', borderColor: "#2C2C2C",}]}>
          <Text style={{color: 'white'}}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
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