import { Injectable } from '@angular/core';
import { BranchEntity } from '../entities/branch.entity';
import { PositionEntity } from '../entities/position.entity';
import { GpsPositionCalculator } from '../util/gps-distance-calculator';
import { Config } from '../config/config';


import 'rxjs/add/operator/map';

declare var MobileTicketAPI: any;

@Injectable()
export class BranchService {

  public branches: Array<BranchEntity>;

  public currentPosition: PositionEntity;
  

  constructor(private config: Config) {
  }

  public convertToBranchEntities(branchList, customerPosition): Array<BranchEntity> {
    let entities: Array<BranchEntity> = [];
    let branchEntity: BranchEntity;
    for (var i = 0; i < branchList.length; i++) {
      branchEntity = new BranchEntity();
      branchEntity.id = branchList[i].id;
      branchEntity.name = branchList[i].name;
      let branchPosition = new PositionEntity(branchList[i].latitude, branchList[i].longitude);
      branchEntity.distance = this.getBranchDistance(branchPosition, customerPosition) + '';
      entities.push(branchEntity);
    }
    return entities;
  }

  public setAdditionalBranchInfo() { }

  public getBranchDistance(branchPosition: PositionEntity, customerPosition: PositionEntity): number {
    let calculator = new GpsPositionCalculator();
    return calculator.getDistanceFromLatLon(customerPosition.latitude,
      customerPosition.longitude, branchPosition.latitude, branchPosition.longitude);
  }

  getBranchesByPosition(customerPosition, radius, onBrancheListFetch) {
    MobileTicketAPI.getBranchesNearBy(customerPosition.latitude, customerPosition.longitude, radius,
      (branchList: any) => {
        onBrancheListFetch(this.convertToBranchEntities(branchList, customerPosition));
      },
      () => {

      });
  }

  getBranches(onBrancheListReceived): void {
    if (location.protocol === 'https:') {
      navigator.geolocation.getCurrentPosition((location) => {
        this.currentPosition = new PositionEntity(location.coords.latitude, location.coords.longitude)
        let radius = this.config.getConfig('branch_radius');
        this.getBranchesByPosition(this.currentPosition, radius, (branchList) => {
          onBrancheListReceived(branchList);
        })
      });
    } else {
      MobileTicketAPI.getAllBranches((branchList) => {
        onBrancheListReceived(branchList, false);
      }, () => {
        onBrancheListReceived(null, true)
      })
    }
  }

  setBranchAddresses(branchList: Array<BranchEntity>): void {
    for (var i = 0; i < branchList.length; i++) {
      let branchId = branchList[i].id;
      MobileTicketAPI.getBranchInformation(branchId,
        (branchInfo) => {
          for (var i = 0; i < branchList.length; i++) {
            if (branchInfo.id === branchList[i].id) {
              let addressLine1, city, country;
              let emptyAddressLine = "";
              for (var j = 0; j < branchInfo.branchParameters.length; j++) {

                if (branchInfo.branchParameters[j].key == 'label.address1' && branchInfo.branchParameters[j].value != null) {
                  addressLine1 = branchInfo.branchParameters[j].value + ", ";
                } else if (branchInfo.branchParameters[j].key == 'label.address1' && branchInfo.branchParameters[j].value == null) {
                  addressLine1 = emptyAddressLine;
                }

                if (branchInfo.branchParameters[j].key == 'label.city' && branchInfo.branchParameters[j].value != null) {
                  city = branchInfo.branchParameters[j].value + ', ';
                } else if (branchInfo.branchParameters[j].key == 'label.city' && branchInfo.branchParameters[j].value == null) {
                  city = emptyAddressLine;
                }

                if (branchInfo.branchParameters[j].key == 'label.country' && branchInfo.branchParameters[j].value != null) {
                  country = branchInfo.branchParameters[j].value;
                } else if (branchInfo.branchParameters[j].key == 'label.country' && branchInfo.branchParameters[j].value == null) {
                  country = emptyAddressLine;
                }

              }

              //following code removes any trailing commas              
              branchList[i].address = (addressLine1 + city + country).trim();
              let lastIndexOfComma = (branchList[i].address).lastIndexOf(',');

              if (lastIndexOfComma === branchList[i].address.length - 1) {
                branchList[i].address = branchList[i].address.substr(0, lastIndexOfComma);
              }
            }
          }
        },
        () => {

        });
    }
  }

  public getSelectedBranch() {
    return MobileTicketAPI.getSelectedBranch().name;
  }
}
