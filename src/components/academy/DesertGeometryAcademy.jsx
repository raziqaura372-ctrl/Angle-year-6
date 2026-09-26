import React, { useState } from 'react';
import { Step1Welcome, Step2WhatIsAnAngle, Step3HowMeasured } from './AcademySteps1to3';
import { Step4TypesOfAngles, Step5DynamicExploration } from './AcademySteps4to5';
import { Step6Measuring, Step7Constructing } from './AcademySteps6to7';
import { Step8Polygons, Step9DesertConnection } from './AcademySteps8to9';
import { Step10Checkpoint, Step11Unlock } from './AcademyCheckpoint';
import { BookOpen, Award, CheckCircle2 } from 'lucide-react';

export default function DesertGeometryAcademy({ onUnlockMission1 }) {
  const [currentStep, setCurrentStep] = useState(1);

  const stepTitles = [
    '1. Welcome',
    '2. Angle Parts',
    '3. Degree Scale',
    '4. Angle Types',
    '5. Dynamic Sandbox',
    '6. Protractor',
    '7. Constructing',
    '8. Polygons',
    '9. Real World',
    '10. Checkpoint',
    '11. Unlock'
  ];

  return (
    <div className="space-y-6">
      {/* Academy Title Header */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Mandatory Concept Foundation Phase
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-amber-200 mt-1">
              DESERT GEOMETRY ACADEMY
            </h2>
            <p className="text-xs text-cyan-200 font-medium">
              Before you begin your expedition, learn how angles help you navigate the desert.
            </p>
          </div>

          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-400/30 text-xs font-bold text-amber-300">
            Academy Step {currentStep} / 11
          </div>
        </div>

        {/* 11-Step Progress Indicator Bar */}
        <div className="grid grid-cols-11 gap-1 mt-4">
          {stepTitles.map((st, i) => {
            const stepNum = i + 1;
            const isCurrent = currentStep === stepNum;
            const isPassed = currentStep > stepNum;

            return (
              <button
                key={i}
                onClick={() => setCurrentStep(stepNum)}
                title={st}
                className={`h-2 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-amber-400 gold-glow'
                    : isPassed
                    ? 'bg-emerald-400'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Render Step Component */}
      {currentStep === 1 && <Step1Welcome onNext={() => setCurrentStep(2)} />}
      {currentStep === 2 && <Step2WhatIsAnAngle onNext={() => setCurrentStep(3)} />}
      {currentStep === 3 && <Step3HowMeasured onNext={() => setCurrentStep(4)} />}
      {currentStep === 4 && <Step4TypesOfAngles onNext={() => setCurrentStep(5)} />}
      {currentStep === 5 && <Step5DynamicExploration onNext={() => setCurrentStep(6)} />}
      {currentStep === 6 && <Step6Measuring onNext={() => setCurrentStep(7)} />}
      {currentStep === 7 && <Step7Constructing onNext={() => setCurrentStep(8)} />}
      {currentStep === 8 && <Step8Polygons onNext={() => setCurrentStep(9)} />}
      {currentStep === 9 && <Step9DesertConnection onNext={() => setCurrentStep(10)} />}
      {currentStep === 10 && (
        <Step10Checkpoint
          onComplete={() => setCurrentStep(11)}
          onReview={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 11 && (
        <Step11Unlock onStartExpedition={onUnlockMission1} />
      )}
    </div>
  );
}
