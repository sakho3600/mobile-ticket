import { Injectable } from '@angular/core';
import { BranchEntity } from '../entities/branch.entity';
import { PositionEntity } from '../entities/position.entity';
import { GpsPositionCalculator } from '../util/gps-distance-calculator';
import { Config } from '../config/config';
import { LocationService } from '../util/location';
import { TranslateService } from 'ng2-translate';
import 'rxjs/add/operator/map';
import { AlertDialogService } from "../shared/alert-dialog/alert-dialog.service";

declare var MobileTicketAPI: any;

@Injectable()
export class BranchService {

  public branches: Array<BranchEntity>;

  public currentPosition: PositionEntity;
  public btnTextSeparator: string = ","; // Default character
  private singleBranch: boolean = false;


  constructor(private config: Config, private currentLocation: LocationService, private translate: TranslateService, private alertDialogService: AlertDialogService) {
    this.translate.get('branch.btn_text_separator').subscribe((separator: string) => {
      this.btnTextSeparator = separator;
    });
  }

  public convertToBranchEntity(branchRes) {
    let branchEntity: BranchEntity;
    branchEntity = new BranchEntity();
    branchEntity.id = branchRes.id;
    branchEntity.name = branchRes.name;
    return branchEntity;

  }
  public convertToBranchEntities(branchList, customerPosition, onUpdateList) {
    let entities: Array<BranchEntity> = [];
    let branchEntity: BranchEntity;
    this.singleBranch = branchList.length === 1;
    for (var i = 0; i < branchList.length; i++) {
      branchEntity = new BranchEntity();
      branchEntity.id = branchList[i].id;
      branchEntity.name = branchList[i].name;
      let branchPosition = new PositionEntity(branchList[i].latitude, branchList[i].longitude);
      if (customerPosition !== undefined)
        branchEntity.distance = this.getBranchDistance(branchPosition, customerPosition) + '';
      entities.push(branchEntity);
    }

    this.setBranchAddresses(branchList, entities, onUpdateList);
  }

  public setAdditionalBranchInfo() {
  }

  public getBranchDistance(branchPosition: PositionEntity, customerPosition: PositionEntity): number {
    let calculator = new GpsPositionCalculator();
    return calculator.getDistanceFromLatLon(customerPosition.latitude,
      customerPosition.longitude, branchPosition.latitude, branchPosition.longitude);
  }

  getBranchesByPosition(customerPosition, radius, onBrancheListFetch) {
    MobileTicketAPI.getBranchesNearBy(customerPosition.latitude, customerPosition.longitude, radius,
      (branchList: any) => {
        this.convertToBranchEntities(branchList, customerPosition, (modifyBranchList) => {
          onBrancheListFetch(modifyBranchList);
        });
      },
      () => {

      });
  }

  getBranchById(id, onBranchRecieved): void {
    /**
     * Do not restrict user from showing only nearby branch if match for the given id
     * when accessing via QR/URL
     */
    /** 
    if (location.protocol === 'https:') {
      let isBranchFound = false;
      this.currentLocation.watchCurrentPosition((currentPosition) => {
        this.currentPosition = new PositionEntity(currentPosition.coords.latitude, currentPosition.coords.longitude)
        let radius = this.config.getConfig('branch_radius');
        this.getBranchesByPosition(this.currentPosition, radius, (branchList) => {
          let branches: Array<BranchEntity> = branchList;
          for (let i = 0; i < branches.length; i++) {
            if (branches[i].id === id) {
              isBranchFound = true;
              onBranchRecieved(branches[i], false);
              break;
            }
          }
          if (!isBranchFound) {
            onBranchRecieved(null, true);
          }

          this.currentLocation.removeWatcher();
        })
      }, (error) => {
        var alertMsg = "";
        this.translate.get('branch.positionPermission').subscribe((res: string) => {
          alertMsg = res;
          this.alertDialogService.activate(alertMsg).then(res => {
            MobileTicketAPI.getBranchInfoById(id, (res) => {
              onBranchRecieved(this.convertToBranchEntity(res), false);
            }, (error) => {
              onBranchRecieved(null, true);
            });
          });
        });
      });
    }
    */

    MobileTicketAPI.getBranchInfoById(id, (res) => {
      onBranchRecieved(this.convertToBranchEntity(res), false);
    }, (error) => {
      onBranchRecieved(null, true);
    });
  }

  getBranches(onBrancheListReceived): void {
    if (location.protocol === 'https:') {
      this.currentLocation.watchCurrentPosition((currentPosition) => {
        this.currentPosition = new PositionEntity(currentPosition.coords.latitude, currentPosition.coords.longitude)
        let radius = this.config.getConfig('branch_radius');
        this.getBranchesByPosition(this.currentPosition, radius, (branchList) => {
          onBrancheListReceived(branchList, false, false);
          this.currentLocation.removeWatcher();
        })
      }, (error) => {
        var alertMsg = "";
        this.translate.get('branch.positionPermission').subscribe((res: string) => {
          alertMsg = res;
          this.alertDialogService.activate(alertMsg).then(res => {
            MobileTicketAPI.getAllBranches((branchList) => {
              this.convertToBranchEntities(branchList, undefined, (modifyBranchList) => {
                onBrancheListReceived(modifyBranchList, false, true);
              });
            }, () => {
              onBrancheListReceived(null, true, false);
              this.currentLocation.removeWatcher();
            });
          });
        });
      });
    }
    else {
      MobileTicketAPI.getAllBranches((branchList) => {
        this.convertToBranchEntities(branchList, undefined, (modifyBranchList) => {
          onBrancheListReceived(modifyBranchList, false, true);
        });
      }, () => {
        onBrancheListReceived(null, true, false)
      })
    }
  }

  setBranchAddresses(branchList, entities: Array<BranchEntity>, onUpdateList) {
    this.translate.get('branch.btn_text_separator').subscribe((separator: string) => {
      let modifyBranchList: Array<BranchEntity> = [];
      for (var i = 0; i < branchList.length; i++) {
        let fliterList = entities.filter(
          branch => branch.id === branchList[i].id);
        let branch = fliterList[0];
        let branchAddress = undefined;
        let addressLine1, city;
        let emptyAddressLine = "";
        let branchData = branchList[i];

        if (branchData.addressLine1 != undefined && branchData.addressLine1 != null) {
          addressLine1 = branchData.addressLine1;
        }
        else {
          addressLine1 = emptyAddressLine;
        }

        if (branchData.addressLine4 != undefined && branchData.addressLine4 != null) {
          city = branchData.addressLine4;
        }
        else {
          city = emptyAddressLine;
        }

        //following code removes any trailing commas
        if (document.dir == "rtl") {
          branchAddress = (this.concatSeparator(city, separator) + addressLine1).trim();
        } else {
          branchAddress = (this.concatSeparator(addressLine1, separator) + this.concatSeparator(city, separator)).trim();
        }
        let lastIndexOfComma = (branchAddress).lastIndexOf(',');

        if (lastIndexOfComma === branchAddress.length - 1) {
          branchAddress = branchAddress.substr(0, lastIndexOfComma);
        }

        branch.address = branchAddress;
        modifyBranchList.push(branch);
      }

      onUpdateList(modifyBranchList);
    });
  }

  private concatSeparator(val, separator) {
    if (val) {
      return val + separator + " ";
    } else {
      return val;
    }
  }

  public getSelectedBranch() {
    try {
      return MobileTicketAPI.getSelectedBranch().name;
    }
    catch (e) {
      return null;
    }
  }

  public isSingleBranch() {
    return this.singleBranch;
  }
}
