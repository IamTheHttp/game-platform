/* global describe */
/* global it */
/* global expect */
/* global beforeEach */
import React from 'react';
import SelectedBox from 'lib/SelectedBox/SelectedBox';

describe('Tests the selected box', () => {
  it('Initiates the selected box', () => {
    let selectedBox = new SelectedBox();

    expect(selectedBox.getData()).toEqual({
      width: 0,
      height: 0,
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    });
  });

  it('sets start and end and then resets', () => {
    let selectedBox = new SelectedBox();


    selectedBox.setStart(5, 5);
    selectedBox.setEnd(100, 100);

    expect(selectedBox.getData()).toEqual({
      width: 95,
      height: 95,
      start: {
        x: 5,
        y: 5
      },
      end: {
        x: 100,
        y: 100
      }
    });

    selectedBox.reset();
    expect(selectedBox.getData()).toEqual({
      width: 0,
      height: 0,
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    });
  });
});