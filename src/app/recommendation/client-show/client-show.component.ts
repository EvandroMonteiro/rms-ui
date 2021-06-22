import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from 'src/app/audit/audit.service';
import { ComplianceService } from 'src/app/compliance/compliance.service';
import { Compliance } from 'src/app/models/compliance';
import { RecommendationCharacter } from 'src/app/models/recommendation-character';
import { RecommendationLevelRisk } from 'src/app/models/recommendation-level-risk';
import { RecommendationStatus } from 'src/app/models/recommendation-status';
import { RecommendationService } from '../recommendation.service';
import { ErrorService } from './../../error/error.service';
import { Recommendation } from './../../models/recommendation';
import { RecommendationNature } from './../../models/recommendation-nature';
import { RecommendationCharacterService } from './../../recommendation-character/recommendation-character.service';
import { RecommendationLevelRiskService } from './../../recommendation-level-risk/recommendation-level-risk.service';
import { RecommendationNatureService } from './../../recommendation-nature/recommendation-nature.service';
import { RecommendationStatusService } from './../../recommendation-status/recommendation-status.service';

@Component({
  selector: 'app-client-show',
  templateUrl: './client-show.component.html',
  styleUrls: ['./client-show.component.scss']
})
export class ClientShowComponent implements OnInit {
  loading: boolean = false;
  display: boolean = false;
  recommendation = new Recommendation();
  compliance = new Compliance();
  id = this.route.snapshot.params.id;

  statuses = [];
  natures = [];
  characters = [];
  levelsRisk = [];

  constructor(
    private recommendationService: RecommendationService,
    private complianceService: ComplianceService,
    private statusService: RecommendationStatusService,
    private natureService: RecommendationNatureService,
    private characterService: RecommendationCharacterService,
    private levelRiskService: RecommendationLevelRiskService,
    private auditService: AuditService,
    private errorService: ErrorService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dropdownStatuses();
    this.dropdownNatures();
    this.dropdownCharacters();
    this.dropdownLevelsRisk();
    this.getById();
  }

  async dropdownStatuses() {
    await this.statusService.readAll()
      .then((result) => this.statuses = result.map(
        (status: RecommendationStatus) => ({
          value: status.id,
          label: status.name
        })))
  }

  async dropdownNatures() {
    await this.natureService.readAll()
      .then((result) => this.natures = result.map(
        (nature: RecommendationNature) => ({
          value: nature.id,
          label: nature.name
        })))
  }

  async dropdownCharacters() {
    await this.characterService.readAll()
      .then((result) => this.characters = result.map(
        (character: RecommendationCharacter) => ({
          value: character.id,
          label: character.name
        })))
  }

  async dropdownLevelsRisk() {
    await this.levelRiskService.readAll()
      .then((result) => this.levelsRisk = result.map(
        (levelRisk: RecommendationLevelRisk) => ({
          value: levelRisk.id,
          label: levelRisk.name
        })))
  }

  getAuditByProcessCode(processCode: string): void {
    this.auditService.getByProcessCode(processCode)
      .then(result => {
        this.recommendation.audit.processCode = result.processCode
      })
      .catch((error) => {
        if (error.code === 404) {
          this.toastr.error('Número de processo inexistente, tente de novo!')
        } else {
          this.errorService.handle(error)
        }
      })
  }

  getById(): void {
    this.recommendationService.getById(this.id)
      .then((result) => this.recommendation = result)
      .catch((error) => this.errorService.handle(error));
  }

  createCompliance(form: NgForm) {
    this.loading = true;
    this.compliance.recommendation.id = this.id;
    delete this.compliance.recommendation.audit.processCode;

    this.complianceService.create(this.compliance)
      .then(() => {
        this.display = false;
        form.reset();
        this.toastr.success('Cumprimento submetido com sucesso!');
      })
      .catch((error) => this.errorService.handle(error))
      .finally(() => this.loading = false)
  }
}
