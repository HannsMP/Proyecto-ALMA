import fs from 'node:fs';
import path from 'node:path';
import type { Express } from 'express';
import JSZip from 'jszip';

export interface PdfManifestEntry {
  code: string;
  renamedFilename: string;
  sourceFolder: 'example' | 'ref';
  originalFilename: string;
  citationShort: string;
  doi: string;
  cluster: string;
  roleType: 'Revisión guía' | 'Estudio primario PRISMA';
}

export const PDF_MANIFEST: PdfManifestEntry[] = [
  // 2 Revisiones sistemáticas guía (data/example)
  {
    code: 'G01',
    renamedFilename: 'Karasheva_2025_ShoulderExoskeletonReview.pdf',
    sourceFolder: 'example',
    originalFilename: '1-s2.0-S2215016125004923-main.pdf',
    citationShort: 'Karasheva et al. (2025)',
    doi: '10.1016/j.mex.2025.103648',
    cluster: 'Revisiones Guía (Plantilla)',
    roleType: 'Revisión guía',
  },
  {
    code: 'G02',
    renamedFilename: 'Shafaie_2026_HRI_ClinicalAI_Review.pdf',
    sourceFolder: 'example',
    originalFilename: '1-s2.0-S2451958826001545-main.pdf',
    citationShort: 'Shafaie et al. (2026)',
    doi: '10.1016/j.chbr.2026.101080',
    cluster: 'Revisiones Guía (Plantilla)',
    roleType: 'Revisión guía',
  },

  // 31 Estudios primarios PRISMA 2020 (data/ref)
  {
    code: 'P01',
    renamedFilename: 'Chen_2026_EIT_PressureSensor.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0263224125020731-main.pdf',
    citationShort: 'Chen et al. (2026)',
    doi: '10.1016/j.measurement.2025.118714',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P02',
    renamedFilename: 'Ly_2026_3DPrintedArmOptimization.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S2212827126011571-main.pdf',
    citationShort: 'Ly et al. (2026)',
    doi: '10.1016/j.procir.2026.03.212',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P03',
    renamedFilename: 'Chen_2023_EMG_VolitionalControl.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S2590005623000024-main.pdf',
    citationShort: 'Chen et al. (2023)',
    doi: '10.1016/j.array.2023.100277',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P04',
    renamedFilename: 'Li_2026_TelerehabilitationFusion.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0263224126010298-main.pdf',
    citationShort: 'Li et al. (2026)',
    doi: '10.1016/j.measurement.2026.121320',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P05',
    renamedFilename: 'Amiri_2025_RBFNN_AdaptiveControl.pdf',
    sourceFolder: 'ref',
    originalFilename: 'TSP_CMES_69167.pdf',
    citationShort: 'Amiri et al. (2025)',
    doi: '10.32604/cmes.2025.069167',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P06',
    renamedFilename: 'Yin_2026_PredefinedTimeSlidingMode.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S2307187726004815-main.pdf',
    citationShort: 'Yin et al. (2026)',
    doi: '10.1016/j.jer.2026.09.048',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P07',
    renamedFilename: 'Chia_2024_AssistAsNeededVelocity.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S095741582300171X-main.pdf',
    citationShort: 'Chia et al. (2024)',
    doi: '10.1016/j.mechatronics.2023.103115',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P08',
    renamedFilename: 'Kansal_2023_LowCost3D_DeepLearning.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0952197623011740-main.pdf',
    citationShort: 'Kansal et al. (2023)',
    doi: '10.1016/j.engappai.2023.106990',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P09',
    renamedFilename: 'Li_2026_SpasticityDetectionAAN.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S095741582500159X-main.pdf',
    citationShort: 'Li et al. (2026)',
    doi: '10.1016/j.mechatronics.2025.103450',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P10',
    renamedFilename: 'Zhang_2022_AdaptiveSlidingMode.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S095741582200068X-main.pdf',
    citationShort: 'Zhang et al. (2022)',
    doi: '10.1016/j.mechatronics.2022.102832',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P11',
    renamedFilename: 'Dong_2025_KinematicOptimalDesign.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0957415825000893-main.pdf',
    citationShort: 'Dong et al. (2025)',
    doi: '10.1016/j.mechatronics.2025.103380',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P12',
    renamedFilename: 'Zhao_2025_UnderactuatedExoGlove.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S2667379725000397-main.pdf',
    citationShort: 'Zhao et al. (2025)',
    doi: '10.1016/j.birob.2025.100248',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P13',
    renamedFilename: 'Li_2025_BarrierFaultTolerantControl.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0019057824005639-main.pdf',
    citationShort: 'Li et al. (2025)',
    doi: '10.1016/j.isatra.2024.11.052',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P14',
    renamedFilename: 'Zheng_2025_Gamified2DOF_Stroke.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S2405896325031829-main.pdf',
    citationShort: 'Zheng et al. (2025)',
    doi: '10.1016/j.ifacol.2025.12.445',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P15',
    renamedFilename: 'Wang_2024_HybridGestureRecognition.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0952197623016081-main.pdf',
    citationShort: 'Wang et al. (2024)',
    doi: '10.1016/j.engappai.2023.107424',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P16',
    renamedFilename: 'BedollaMartinez_2023_InverseKinematics.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0952197623011508-main.pdf',
    citationShort: 'Bedolla-Martinez et al. (2023)',
    doi: '10.1016/j.engappai.2023.106966',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P17',
    renamedFilename: 'Kim_2022_CustomizedStrokeTherapy.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0921889022000720-main.pdf',
    citationShort: 'Kim et al. (2022)',
    doi: '10.1016/j.robot.2022.104128',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P18',
    renamedFilename: 'Zhang_2025_PrescribedPerformanceSMC.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0307904X25001027-main.pdf',
    citationShort: 'Zhang et al. (2025)',
    doi: '10.1016/j.apm.2025.116027',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P19',
    renamedFilename: 'Goncalves_2026_CableDrivenBimanual.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S092188902600312X-main.pdf',
    citationShort: 'Gonçalves et al. (2026)',
    doi: '10.1016/j.robot.2026.105640',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P20',
    renamedFilename: 'Wang_2025_EchoStateTrajectory.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0921889024002203-main.pdf',
    citationShort: 'Wang et al. (2025)',
    doi: '10.1016/j.robot.2024.104836',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P21',
    renamedFilename: 'ToroOssaba_2024_ElbowMRAC_ESP32.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S096706612300343X-main.pdf',
    citationShort: 'Toro-Ossaba et al. (2024)',
    doi: '10.1016/j.conengprac.2023.105774',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P22',
    renamedFilename: 'Zhang_2026_Modular3DActuator.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0924424725010891-main.pdf',
    citationShort: 'Zhang et al. (2026)',
    doi: '10.1016/j.sna.2025.117283',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P23',
    renamedFilename: 'Kang_2026_DelayCompensationIMU_EMG.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S092188902600148X-main.pdf',
    citationShort: 'Kang et al. (2026)',
    doi: '10.1016/j.robot.2026.105475',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P24',
    renamedFilename: 'Ventura_2026_WristTelerehabML.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0957415825001321-main.pdf',
    citationShort: 'Ventura et al. (2026)',
    doi: '10.1016/j.mechatronics.2025.103423',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P25',
    renamedFilename: 'Shah_2026_RL_ShoulderAssistAsNeeded.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0957415826000152-main.pdf',
    citationShort: 'Shah (2026)',
    doi: '10.1016/j.mechatronics.2026.103467',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P26',
    renamedFilename: 'Chai_2023_ZeroingNeuralInteraction.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0952197623002920-main.pdf',
    citationShort: 'Chai et al. (2023)',
    doi: '10.1016/j.engappai.2023.106108',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P27',
    renamedFilename: 'Foroutannia_2023_FuzzyImpedanceCNN.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0957415823000089-main.pdf',
    citationShort: 'Foroutannia et al. (2023)',
    doi: '10.1016/j.mechatronics.2023.102952',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P28',
    renamedFilename: 'Zhang_2024_FixedTimeWearableControl.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S2590123025006413-main.pdf',
    citationShort: 'Zhang et al. (2024)',
    doi: '10.1016/j.conengprac.2024.106011',
    cluster: 'Control Adaptativo y Seguridad',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P29',
    renamedFilename: 'Ullah_2024_ExoMechHand3D_EMG.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S1350453323001509-main.pdf',
    citationShort: 'Ullah et al. (2024)',
    doi: '10.1016/j.medengphy.2023.104095',
    cluster: 'Exoesqueletos y Diseño 3D',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P30',
    renamedFilename: 'Sittiruk_2026_ProcessorInLoopForce.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0045790626002715-main.pdf',
    citationShort: 'Sittiruk et al. (2026)',
    doi: '10.1016/j.compeleceng.2026.111199',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
  {
    code: 'P31',
    renamedFilename: 'Guo_2022_VoiceGlove.pdf',
    sourceFolder: 'ref',
    originalFilename: '1-s2.0-S0957415822000058-main.pdf',
    citationShort: 'Guo et al. (2022)',
    doi: '10.1016/j.mechatronics.2022.102745',
    cluster: 'IA, Voz, NLP y Telerehabilitación',
    roleType: 'Estudio primario PRISMA',
  },
];

function resolveEntryPath(entry: PdfManifestEntry): string {
  return path.resolve(process.cwd(), 'data', entry.sourceFolder, entry.originalFilename);
}

export function registerEntregablesRoutes(app: Express): void {
  // Listado auditable de los 33 PDFs renombrados (31 primarios + 2 revisiones guía)
  app.get('/api/entregables/articulos', (_req, res) => {
    const items = PDF_MANIFEST.map((entry) => {
      const fullPath = resolveEntryPath(entry);
      const exists = fs.existsSync(fullPath);
      const sizeBytes = exists ? fs.statSync(fullPath).size : 0;
      return {
        ...entry,
        exists,
        sizeBytes,
      };
    });
    res.json({
      folderName: 'E07_Articulos_Incluidos_PDF',
      total: items.length,
      items,
    });
  });

  // Descarga individual o vista previa inline (lista blanca estricta contra path traversal)
  app.get('/api/entregables/articulo/:filename', (req, res) => {
    const requested = req.params.filename;
    const entry = PDF_MANIFEST.find((item) => item.renamedFilename === requested);
    if (!entry) {
      res.status(404).json({ error: 'Artículo PDF no encontrado en el manifiesto E07.' });
      return;
    }

    const fullPath = resolveEntryPath(entry);
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ error: `El archivo fuente ${entry.originalFilename} no existe en disco.` });
      return;
    }

    const forceDownload = req.query.download === '1' || req.query.download === 'true';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${forceDownload ? 'attachment' : 'inline'}; filename="${entry.renamedFilename}"`,
    );
    res.sendFile(fullPath);
  });

  // Paquete ZIP completo con los 33 PDFs renombrados bajo E07_Articulos_Incluidos_PDF/
  app.get('/api/entregables/articulos-zip', async (_req, res) => {
    try {
      const zip = new JSZip();
      const folder = zip.folder('E07_Articulos_Incluidos_PDF');
      if (!folder) {
        res.status(500).json({ error: 'No se pudo inicializar el archivo ZIP.' });
        return;
      }

      let addedCount = 0;
      for (const entry of PDF_MANIFEST) {
        const fullPath = resolveEntryPath(entry);
        if (fs.existsSync(fullPath)) {
          const buffer = fs.readFileSync(fullPath);
          folder.file(entry.renamedFilename, buffer);
          addedCount++;
        }
      }

      const manifestTxt = [
        'E07_Articulos_Incluidos_PDF — Proyecto ALMA (Grupo G01, UPN)',
        `Total de artículos incluidos en paquete: ${addedCount} de ${PDF_MANIFEST.length}`,
        'Convención de nombrado: Autor_Año_PalabraClave.pdf',
        '========================================================================',
        ...PDF_MANIFEST.map(
          (e) =>
            `${e.code} | ${e.renamedFilename} | ${e.roleType} | DOI: https://doi.org/${e.doi} | Fuente original: data/${e.sourceFolder}/${e.originalFilename}`,
        ),
      ].join('\n');
      folder.file('00_INDICE_E07_ARTICULOS.txt', manifestTxt);

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'STORE',
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="E07_Articulos_Incluidos_PDF.zip"');
      res.setHeader('Content-Length', String(zipBuffer.length));
      res.send(zipBuffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error generando ZIP E07';
      res.status(500).json({ error: message });
    }
  });
}
