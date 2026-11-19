package com.github.francescopaci.timesheet.controller;


import com.github.francescopaci.timesheet.entity.Project;
import com.github.francescopaci.timesheet.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/getProjects")
    public List<Project> getProjects() {
        return projectService.getProjects();
    }

}