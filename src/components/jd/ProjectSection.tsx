"use client";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './ProjectSection.module.css';
import { portfolioData } from '../../data/jd/portfolio';

const EllipseGallery = lazy(() => import('./EllipseGallery'));
const ProjectDetailModal = lazy(() => import('./ProjectDetailModal'));

// Types
type Project = {
    title: string;
    description: string;
    detailDescription?: string;
    period: string;
    image?: string;
    tags?: string[];
    video?: string;
    cardVideo?: string;
    imageFit?: "cover" | "contain";
    imagePadding?: string;
    imagePosition?: string;
    backgroundColor?: string;
};

type Subcategory = {
    title: string;
    projects: Project[];
};

type Category = {
    id: string;
    title: string;
    description: string;
    subcategories: Subcategory[];
};

const findProjectByTitle = (title: string, categories: Category[]): Project | null => {
    for (const cat of categories) {
        for (const sub of cat.subcategories) {
            for (const proj of sub.projects) {
                if (proj.title === title) return proj;
            }
        }
    }
    return null;
};

const ProjectSection = () => {
    // @ts-ignore
    const categories = portfolioData.categories as Category[];
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalRect, setModalRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        const projectTitle = searchParams.get('project');
        if (projectTitle) {
            const project = findProjectByTitle(projectTitle, categories);
            if (project) setSelectedProject(project);
        } else {
            setSelectedProject(null);
        }
    }, [searchParams, categories]);

    const handleProjectSelect = (project: Project, rect: DOMRect) => {
        const { top, left, width, height } = rect;
        setModalRect({ top, left, width, height });
        setSelectedProject(project);
        const params = new URLSearchParams(searchParams.toString());
        params.set('project', project.title);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    const handleCloseModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('project');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const allProjects = React.useMemo(() => {
        const flattened: any[] = [];
        categories.forEach(cat => {
            cat.subcategories.forEach(sub => {
                sub.projects.forEach(proj => {
                    flattened.push({ ...proj, category: cat.title });
                });
            });
        });
        return flattened;
    }, [categories]);

    const galleryProjects = React.useMemo(() => {
        return allProjects;
    }, [allProjects]);

    return (
        <section className={styles.categorySection} id="projects">
            <div className={styles.mainHeader}>
                <h2 className={styles.mainTitle}>Projects</h2>
            </div>

            {/* Rebuilt 3D Gallery Engine */}
            <Suspense fallback={<div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading 3D Engine...</div>}>
                <EllipseGallery
                    projects={galleryProjects as any}
                    onProjectSelect={handleProjectSelect}
                />
            </Suspense>

            <Suspense fallback={null}>
                <ProjectDetailModal
                    project={selectedProject}
                    initialRect={modalRect}
                    onClose={handleCloseModal}
                />
            </Suspense>
        </section>
    );
};

export default ProjectSection;
