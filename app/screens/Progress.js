import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  FlatList,
  StyleSheet
} from "react-native";
import store from "react-native-simple-store";
import IconButton from "../components/IconButton";
import AlertBox from "../components/AlertBox";
import List from "../components/List";
import { Permissions, Camera, FileSystem } from "expo";
import progress_data from "../data/progress";
import { getPathSafeDatetime, uniqid, friendlyDate } from "../lib/general";

export default class Progress extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    is_camera_visible: false,
    is_photo_visible: false,
    progress_photos: []
  };

  constructor(props) {
    super(props);
    // the full path to where the photos should be saved (includes the trailing slash)
    this.document_dir = FileSystem.documentDirectory;
    // prefix all file names with this string
    this.filename_prefix = "increment_photo_";
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: "Progress",
      headerRight: (
        <IconButton
          size={25}
          color="#FFF"
          onPress={() => {
            params.openCamera();
          }}
        />
      )
    };
  };

  openCamera = () => {
    this.setState({
      is_camera_visible: true
    });
  };

  closeCamera = () => {
    this.setState({
      is_camera_visible: false
    });
  };

  flipCamera = () => {
    const phoneCamera = Camera.Constants.Type;
    this.setState({
      type:
        this.state.type === phoneCamera.back
          ? phoneCamera.front
          : phoneCamera.back
    });
  };

  takePicture = async () => {
    if (this.camera) {
      const datetime = getPathSafeDatetime();
      const file_path = `${this.document_dir}${
        this.filename_prefix
      }${datetime}.jpg`;
      const data = await this.camera.takePictureAsync();

      await FileSystem.moveAsync({
        // the path to where the photo is saved in the cache directory
        from: data.uri,
        to: file_path
      });

      let photo_data = {
        key: uniqid(), // unique ID for the photo
        name: datetime // the photo's filename
      };
      store.push("progress_photos", photo_data); // save it on local storage

      this.setState({
        progress_photos: [...this.state.progress_photos, photo_data]
      });

      Alert.alert("Saved", "Your photo was successfully saved!");
    }
  };

  showPhoto = item => {
    this.setState({
      is_photo_visible: true,
      current_image: {
        url: `${this.document_dir}${this.filename_prefix}${item.name}.jpg`,
        label: friendlyDate(item.name)
      }
    });
  };

  closePhoto = () => {
    this.setState({
      is_photo_visible: false
    });
  }

  componentWillMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.wrapper}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.is_camera_visible}
            onRequestClose={() => {
              this.setState({
                is_camera_visible: false
              });
            }}
          >
            <View style={{ flex: 1 }}>
              <Camera
                style={styles.wrapper}
                type={this.state.type}
                ref={ref => {
                  this.camera = ref;
                }}
              >
                <View style={styles.camera_body}>
                  <View style={styles.upper_buttons_container}>
                    <IconButton
                      is_transparent={true}
                      icon="close"
                      styles={[
                        styles.camera_button,
                        styles.camera_close_button
                      ]}
                      onPress={this.closeCamera}
                    />

                    <IconButton
                      is_transparent={true}
                      icon="flip"
                      styles={[styles.camera_button, styles.camera_flip_button]}
                      onPress={this.flipCamera}
                    />
                  </View>

                  <View style={styles.lower_buttons_container}>
                    <IconButton
                      is_transparent={true}
                      icon="photo-camera"
                      styles={styles.camera_photo_button}
                      onPress={this.takePicture}
                    />
                  </View>
                </View>
              </Camera>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.is_photo_visible}
            onRequestClose={() =>
              this.setState({
                is_photo_visible: false
              })
            }
          >
            <View style={styles.modal}>
              {this.state.current_image && (
                <View style={styles.wrapper}>
                  <Image
                    source={{ uri: this.state.current_image.url }}
                    style={styles.wrapper}
                    ImageResizeMode={"contain"}
                  />

                  <IconButton
                    is_transparent={true}
                    icon="close"
                    styles={styles.close_button}
                    onPress={this.closePhoto}
                  />

                  <View style={styles.photo_label}>
                    <Text style={styles.photo_label_text}>
                      {this.state.current_image.label}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Modal>
          {this.state.progress_photos.length == 0 && (
            <AlertBox
              text="You haven't taken any progress pictures yet."
              type="info"
            />
          )}
          {this.state.progress_photos.length > 0 && (
            <FlatList
              data={this.state.progress_photos}
              numColumns={2}
              renderItem={this.renderItem}
            />
          )}
        </View>
      );
    }
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({
      openCamera: this.openCamera
    });
    const response = await store.get("progress_photos");
    if (response) {
      console.log(response)
      this.setState({
        progress_photos: response
      });
    }
  };

  renderItem = ({ item }) => {
    let name = friendlyDate(item.name);
    let photo_url = `${this.document_dir}${this.filename_prefix}${
      item.name
    }.jpg`;
    return (
      <TouchableHighlight
        key={item.key}
        style={styles.list_item}
        underlayColor="#ccc"
        onPress={() => {
          this.showPhoto(item);
        }}
      >
        <View style={styles.image_container}>
          <Image
            source={{ uri: photo_url }}
            style={styles.image}
            ImageResizeMode={"contain"}
          />
          <Text style={styles.image_text}>{name}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

const styles = StyleSheet.create({
  list_item: {
    padding: 20
  },
  image_container: {
    alignItems: "center"
  },
  image: {
    width: 150,
    height: 150
  },
  image_text: {
    fontWeight: "bold"
  },
  wrapper: {
    flex: 1
  },
  modal: {
    // marginTop: 22,
    flex: 1
  },
  camera_body: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column"
  },
  upper_buttons_container: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  lower_buttons_container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "flex-end"
  },
  camera_button: {
    padding: 10
  },
  camera_close_button: {
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  camera_flip_button: {
    alignSelf: "flex-start",
    alignItems: "flex-end"
  },
  camera_photo_button: {
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: 10
  },
  close_button: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10
  },
  photo_label: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 5
  },
  photo_label_text: {
    color: "#FFF"
  }
});
