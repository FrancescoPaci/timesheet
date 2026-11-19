package com.github.francescopaci.timesheet.service;

import com.github.francescopaci.timesheet.entity.Project;
import com.github.francescopaci.timesheet.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }
}
