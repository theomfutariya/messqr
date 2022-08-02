import {StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  getAdmins,
  getDate,
  getInventory,
  getInventoryByDate,
  getPlateByDate,
  getPlates,
} from '../firebase';
import {
  VictoryStack,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import DatePicker from 'react-native-date-picker';
import {ScrollView} from 'react-native-gesture-handler';

export default function Admin() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [pickFor, setPickFor] = useState('');
  const [data, setData] = useState(null);

  const [breakfasts, setBreakfasts] = useState(null);
  const [lunches, setLunches] = useState(null);
  const [dinners, setDinners] = useState(null);

  const platesByDates = async () => {
    await getPlates().then(plates => {
      console.log(plates);
      let breakfastList = [];
      let lunchList = [];
      let dinnerList = [];
      Object.keys(plates).forEach(key => {
        console.log(key);
        breakfastList.push({x: key, y: plates[key]['breakfast']});
        lunchList.push({x: key, y: plates[key]['lunch']});
        dinnerList.push({x: key, y: plates[key]['dinner']});
      });
      setBreakfasts(breakfastList);
      setLunches(lunchList);
      setDinners(dinnerList);
    });
  };

  // {
  // "02-07-2022": {"breakfast": 1, "dinner": 1, "lunch": 3},
  //  "30-07-2022": {"breakfast": 0, "dinner": 0, "lunch": 1}
  // }

  return (
    <View style={styles.container}>
      {/* <Button title="Get Admins" onPress={() => getAdmins()}></Button> */}
      <View style={styles.buttonsContainer}>
        <ScrollView horizontal={true} style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => platesByDates()}>
            <Text style={styles.btnText}>Plates/Dates</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            title="Get Inventory"
            onPress={() => getInventory()}>
            <Text style={styles.btnText}>Inventory/Dates</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            title="Get Plates BD"
            onPress={() => {
              setOpen(true);
              setPickFor('plate');
            }}>
            <Text style={styles.btnText}>Plates by Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            title="Get Inventory BD"
            onPress={() => {
              setOpen(true);
              setPickFor('inventory');
            }}>
            <Text style={styles.btnText}>Inventory by Date</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <DatePicker
        style={styles.datePicker}
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          if (pickFor === 'inventory') {
            getInventoryByDate(getDate(date));
          } else if (pickFor === 'plate') {
            getPlateByDate(getDate(date));
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryStack colorScale={['tomato', 'orange', 'gold']}>
          <VictoryBar data={breakfasts} />
          <VictoryBar data={lunches} />
          <VictoryBar data={dinners} />
        </VictoryStack>
      </VictoryChart>
      <View style={{flexDirection: 'row'}}>
        <View style={[styles.colorTile, {backgroundColor: 'tomato'}]}>
          <Text>Breakfast</Text>
        </View>
        <View style={[styles.colorTile, {backgroundColor: 'orange'}]}>
          <Text>Lunch</Text>
        </View>
        <View style={[styles.colorTile, {backgroundColor: 'gold'}]}>
          <Text>Dinner</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 10,
  },
  buttonsContainer: {
    // backgroundColor: 'red',
    height: 70,
  },
  button: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 10,
    borderRadius: 30,
  },
  btnText: {
    color: 'black',
    fontWeight: '300',
  },
  colorTile: {
    padding: 3,
  },
});
