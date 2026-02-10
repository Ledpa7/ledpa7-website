import React from 'react';
import { MainLayout } from '../layouts/MainLayout';

export const About: React.FC = () => {
    return (
        <MainLayout>
            <div className="max-w-[720px] mx-auto px-12 py-40 mb-40 text-black font-['LINE_Seed_Sans_KR']">

                {/* Main Heading */}
                <section className="mb-24">
                    <h1 className="text-[42px] font-bold leading-tight tracking-tighter text-[#FF0000]">
                        Minimal materials,<br />
                        simple form,<br />
                        user-friendly
                    </h1>
                </section>

                {/* Intro Story */}
                <section className="space-y-12 mb-32">
                    <div className="text-[13px] leading-[1.8] space-y-8 font-medium">
                        <div className="space-y-1">
                            <p className="text-black">안녕하세요. 발광다이오드를 만들어가고 있는 지두입니다.</p>
                            <p className="text-black/30">Hello, I'm Jidu who is making Led.</p>
                        </div>

                        <p className="text-black/80">
                            발광다이오드는 크리에이터를 중심으로, 하고 싶은 것, 잘하는 것, 잘할 수 있는 것을 하는 디자인브랜드입니다.
                            브랜드는 최소한의 재료[Minimal]로 단순한 형태[Simple]를 사용자가 쉽게 사용하는 것[Easy]을 중심으로
                            '공감할 수 있는 필요한 물건을 많은 사람들이 오래 사용하는 것'을 목표로 합니다.
                            오랜 시간에 걸쳐 이야기하는 브랜드가 되겠습니다. 감사합니다.
                        </p>

                        <p className="text-black/30 leading-relaxed italic">
                            Led is a design brand centered on creators, focusing on what they want to do, what they're good at, and what they can excel at. The brand evolves around Minimal materials, Simple forms, and Easy use, aiming to create "essential objects that many can empathize with and use for a long time." We strive to be a brand that continues its story over the long term.
                        </p>
                    </div>
                </section>

                {/* Sub Sections: Philosophy, Naming, Creator */}
                <div className="space-y-24">

                    {/* Philosophy */}
                    <section className="space-y-6">
                        <div className="text-[13px] leading-[1.8] space-y-4 font-medium">
                            <p className="text-black/80">
                                발광다이오드는 산업에서 쓰이는 알루미늄프로파일로 가구를 만듭니다.
                                모든 디자인은 100개만 완제품으로 판매 됩니다.
                                모두 판매되면 만드는 방법을 공유하고, 알루미늄프로파일을 구하여 만들거나, 판매되는 키트를 구매하여 직접 만들 수 있습니다.
                            </p>
                            <p className="text-black/30 italic">
                                Led. makes furniture using industrial aluminum profiles. Each design is limited to 100 finished pieces. Once sold out, we share the making process so anyone can source materials or purchase kits to build it themselves.
                            </p>
                        </div>
                    </section>

                    {/* Naming Rule */}
                    <section className="space-y-6">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Product Naming</h2>
                        <div className="text-[13px] leading-[1.8] space-y-4 font-medium">
                            <p className="font-bold text-black border-l-2 border-black pl-4">EX) S 013 STOOL</p>
                            <p className="text-black/80">
                                S는 제품의 시리즈, 013은 13개의 부품 수, stool은 제품군을 의미합니다.
                            </p>
                            <div className="pt-4 space-y-3">
                                <p className="text-black/70"><span className="font-bold text-black mr-4 w-4 inline-block">S</span> Signature : 미니멀 / 심플 / 이지 코어밸류 시그니처</p>
                                <p className="text-black/70"><span className="font-bold text-black mr-4 w-4 inline-block">A</span> Art : 예술적 요소를 최우선으로 한 디자인</p>
                                <p className="text-black/70"><span className="font-bold text-black mr-4 w-4 inline-block">P</span> Parts : 기타 부품 및 액세서리 제품군</p>
                            </div>
                        </div>
                    </section>

                    {/* Info Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-12 border-t border-black/5">
                        <div className="space-y-6">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Creator</h2>
                            <div className="text-[13px] space-y-1 font-medium">
                                <p className="font-bold text-black text-[16px]">JI-DU</p>
                                <p className="text-black/30 italic">1991, Anyang KR</p>
                                <p className="text-black/60">Lives and works in Anyang</p>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Education</h2>
                                <div className="text-[12px] text-black/60 space-y-1 font-medium">
                                    <p>Craft Design, Inha Tech</p>
                                    <p>Experience Design, SADI</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Exhibitions</h2>
                                <div className="text-[12px] text-black/60 space-y-1 font-medium">
                                    <p>2023 Seoul Design Festival, Young Designer</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-40 pt-16">
                    <p className="text-[10px] text-black/20 font-bold uppercase tracking-[0.4em]">
                        © 2024 LED. ALL RIGHTS RESERVED.
                    </p>
                </div>

            </div>
        </MainLayout>
    );
};
