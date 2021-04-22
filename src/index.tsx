/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';

import { TouchableOpacity, View } from 'react-native';

import moment, { Moment } from 'moment';
import Modal from 'react-native-modal';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';

import { Div, Icon, Text } from 'react-native-magnus';

const { width } = Dimensions.get('screen');

import 'moment/locale/pt-br';

moment.locale('pt-br');

export interface DatePickerProps {
  startDate?: Date;
  endDate?: Date;
  ref?: any;
  onChange?: (startDate: Date, endDate: Date) => void;
}

export interface DatePickerRef {
  close: () => void;
  open: () => void;
}

const DatePicker = React.forwardRef<DatePickerRef, DatePickerProps>(
  ({ startDate, endDate, onChange }, ref) => {
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [finishDate, setFinishDate] = useState<Date>(new Date());

    const [openModal, setOpenModal] = useState(false);

    const refCalendar = useRef<CalendarPicker>(null);

    useImperativeHandle(ref, () => ({
      open() {
        setOpenModal(true);
      },
      close() {
        setOpenModal(false);
      },
    }));

    useEffect(() => {
      if (endDate !== undefined) {
        setFinishDate(endDate);
      }
    }, [endDate]);

    useEffect(() => {
      if (startDate !== undefined) {
        setInitialDate(startDate);
      }
    }, [startDate]);

    const handleDate = useCallback(
      (date: Date, type: 'START_DATE' | 'END_DATE') => {
        if (type === 'END_DATE') {
          setFinishDate(date);
        } else {
          setInitialDate(date);
        }
      },
      []
    );

    const handleOk = useCallback(() => {
      if (typeof onChange === 'function') {
        onChange(initialDate as Date, finishDate as Date);
      }
      setOpenModal(false);
    }, [finishDate, onChange, initialDate]);

    const handlePrevMounth = useCallback(() => {
      refCalendar.current?.handleOnPressPrevious();
    }, [refCalendar]);

    const handleNextMounth = useCallback(() => {
      refCalendar.current?.handleOnPressNext();
    }, [refCalendar]);

    return (
      <Modal
        onDismiss={() => setOpenModal(false)}
        isVisible={openModal}
        animationIn="fadeIn"
        onBackdropPress={() => setOpenModal(false)}
      >
        <Div bg={'white'} rounded={8} mx={16}>
          <Div p={16} bg={'#11A557'} roundedTop={8}>
            <Div>
              <Text style={styles.title}>Selecione um período</Text>
            </Div>
            <Div mt={16}>
              <Text color="white" fontWeight="bold" fontSize={24}>
                {moment(initialDate).format('DD [de] MMMM')} -{' '}
                {moment(finishDate).format('DD [de] MMMM')}
              </Text>
            </Div>
          </Div>

          <Div mt={8}>
            <CalendarPicker
              width={width - 48}
              ref={refCalendar}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              selectedDayColor={'#def0e8'}
              onDateChange={(v: Moment, type: any) =>
                handleDate(v?.toDate(), type)
              }
              allowRangeSelection
              selectedRangeStartTextStyle={{
                color: 'white',
              }}
              selectedRangeStartStyle={{
                backgroundColor: '#11A557',
              }}
              selectedRangeEndTextStyle={{
                color: 'white',
              }}
              selectedRangeEndStyle={{
                backgroundColor: '#11A557',
              }}
              weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
              months={[
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
              ]}
              previousComponent={
                <View style={styles.previousWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handlePrevMounth()}
                  >
                    <Icon
                      name="caretleft"
                      fontFamily="AntDesign"
                      fontSize={16}
                      color={'#2C2C2C'}
                    />
                  </TouchableOpacity>
                </View>
              }
              nextComponent={
                <View style={styles.nextWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleNextMounth()}
                  >
                    <Icon
                      fontFamily="AntDesign"
                      name="caretright"
                      fontSize={16}
                      color={'#2C2C2C'}
                    />
                  </TouchableOpacity>
                </View>
              }
            />
          </Div>
          <Div flexDir={'row'} justifyContent={'center'} p={16}>
            <Div flex={1} mr={8}>
              <Button
                labelStyle={[{ color: '#2C2C2C' }, styles.buttonLabel]}
                onPress={() => setOpenModal(false)}
                testID="datepicker-cancel"
                uppercase={false}
              >
                Cancelar
              </Button>
            </Div>
            <Div flex={1} ml={8}>
              <Button
                mode="contained"
                labelStyle={styles.buttonLabel}
                onPress={() => handleOk()}
                testID="datepicker-ok"
                color={'#11A557'}
              >
                Ok
              </Button>
            </Div>
          </Div>
        </Div>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previousWrapper: {
    paddingLeft: 6,
    paddingTop: 6,
    width: 20,
  },
  nextWrapper: {
    paddingTop: 6,
    paddingRight: 6,
  },
  buttonLabel: {
    fontSize: 18,
  },
});

export default DatePicker;
