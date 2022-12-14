package edu.ucsb.cs156.example.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@WebMvcTest(controllers = HelpRequestController.class)
@Import(TestConfig.class)
public class HelpRequestControllerTests extends ControllerTestCase {
    @MockBean
    HelpRequestRepository helpRequestRepository;

    @MockBean
    UserRepository userRepository;

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/helprequest/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/helprequest/all"))
                            .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
            mockMvc.perform(get("/api/helprequest?id=1"))
                            .andExpect(status().is(403)); // logged out users can't get by id
    }

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/helprequest/post"))
                            .andExpect(status().is(403));
    }
    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/helprequest/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

            // arrange
            LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

            HelpRequest helpRequest = HelpRequest.builder()
                            .requesterEmail("cgaucho@ucsb.edu")
                            .teamId("7pm-2")
                            .tableOrBreakoutRoom("table")
                            .requestTime(ldt)
                            .explanation("need help")
                            .solved(false)
                            .build();

            when(helpRequestRepository.findById(eq(1L))).thenReturn(Optional.of(helpRequest));

            // act
            MvcResult response = mockMvc.perform(get("/api/helprequest?id=1"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(helpRequestRepository, times(1)).findById(eq(1L));
            String expectedJson = mapper.writeValueAsString(helpRequest);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

            // arrange

            when(helpRequestRepository.findById(eq(1L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(get("/api/helprequest?id=1"))
                            .andExpect(status().isNotFound()).andReturn();

            // assert

            verify(helpRequestRepository, times(1)).findById(eq(1L));
            Map<String, Object> json = responseToJson(response);
            assertEquals("EntityNotFoundException", json.get("type"));
            assertEquals("HelpRequest with id 1 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_helprequests() throws Exception {

            // arrange
            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            HelpRequest helpRequest1 = HelpRequest.builder()
                            .requesterEmail("cgaucho@ucsb.edu")
                            .teamId("7pm-2")
                            .tableOrBreakoutRoom("table")
                            .requestTime(ldt1)
                            .explanation("need help")
                            .solved(false)
                            .build();

            LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

            HelpRequest helpRequest2 = HelpRequest.builder()
                            .requesterEmail("dgaucho@ucsb.edu")
                            .teamId("7pm-3")
                            .tableOrBreakoutRoom("breakout")
                            .requestTime(ldt2)
                            .explanation("need help")
                            .solved(false)
                            .build();

            ArrayList<HelpRequest> expectedHelpRequests = new ArrayList<>();
            expectedHelpRequests.addAll(Arrays.asList(helpRequest1, helpRequest2));

            when(helpRequestRepository.findAll()).thenReturn(expectedHelpRequests);

            // act
            MvcResult response = mockMvc.perform(get("/api/helprequest/all"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(helpRequestRepository, times(1)).findAll();
            String expectedJson = mapper.writeValueAsString(expectedHelpRequests);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_helprequest() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            HelpRequest helpRequest1 = HelpRequest.builder()
                            .requesterEmail("cgaucho@ucsb.edu")
                            .teamId("7pm-2")
                            .tableOrBreakoutRoom("table")
                            .requestTime(ldt1)
                            .explanation("need help")
                            .solved(false)
                            .build();

            when(helpRequestRepository.save(eq(helpRequest1))).thenReturn(helpRequest1);

            // act
            MvcResult response = mockMvc.perform(
                            post("/api/helprequest/post?explanation=need help&requesterEmail=cgaucho@ucsb.edu&requestTime=2022-01-03T00:00:00&tableOrBreakoutRoom=table&teamId=7pm-2")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(helpRequestRepository, times(1)).save(helpRequest1);
            String expectedJson = mapper.writeValueAsString(helpRequest1);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_request() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            HelpRequest helpRequest1 = HelpRequest.builder()
                            .requesterEmail("cgaucho@ucsb.edu")
                            .teamId("7pm-2")
                            .tableOrBreakoutRoom("table")
                            .requestTime(ldt1)
                            .explanation("need help")
                            .solved(false)
                            .build();

            when(helpRequestRepository.findById(eq(1L))).thenReturn(Optional.of(helpRequest1));

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/helprequest?id=1")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(helpRequestRepository, times(1)).findById(1L);
            verify(helpRequestRepository, times(1)).delete(any());

            Map<String, Object> json = responseToJson(response);
            assertEquals("HelpRequest with id 1 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_helprequest_and_gets_right_error_message()
                    throws Exception {
            // arrange

            when(helpRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/helprequest?id=15")
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(helpRequestRepository, times(1)).findById(15L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("HelpRequest with id 15 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_helprequest() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
            LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");

            HelpRequest helpRequestOrig = HelpRequest.builder()
                            .id(1)
                            .requesterEmail("cgaucho@ucsb.edu")
                            .teamId("7pm-2")
                            .tableOrBreakoutRoom("table")
                            .requestTime(ldt1)
                            .explanation("need help")
                            .solved(false)
                            .build();

            HelpRequest helpRequestEdited = HelpRequest.builder()
                            .id(1)
                            .requesterEmail("dgaucho@ucsb.edu")
                            .teamId("8pm-2")
                            .tableOrBreakoutRoom("breakout")
                            .requestTime(ldt2)
                            .explanation("ned help")
                            .solved(true)
                            .build();

            String requestBody = mapper.writeValueAsString(helpRequestEdited);

            when(helpRequestRepository.findById(eq(1L))).thenReturn(Optional.of(helpRequestOrig));

            // act
            MvcResult response = mockMvc.perform(
                put("/api/helprequest?id=1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .characterEncoding("utf-8")
                                .content(requestBody)
                                .with(csrf()))
                .andExpect(status().isOk()).andReturn();
            assertEquals(requestBody, response.getResponse().getContentAsString());

            // assert
            verify(helpRequestRepository, times(1)).findById(1L);
            verify(helpRequestRepository, times(1)).save(helpRequestEdited);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_helprequest_that_does_not_exist() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            HelpRequest helpRequestEdited = HelpRequest.builder()
                            .requesterEmail("cgaucho@ucsb.edu")
                            .teamId("7pm-2")
                            .tableOrBreakoutRoom("table")
                            .requestTime(ldt1)
                            .explanation("need help")
                            .solved(false)
                            .build();


            String requestBody = mapper.writeValueAsString(helpRequestEdited);

            when(helpRequestRepository.findById(eq(1L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/helprequest?id=1")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(helpRequestRepository, times(1)).findById(1L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("HelpRequest with id 1 not found", json.get("message"));

    }
}
