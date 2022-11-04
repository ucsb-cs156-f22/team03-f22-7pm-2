package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;



@WebMvcTest(controllers = UCSBOrganizationController.class)
@Import(TestConfig.class)
public class UCSBOrganizationControllerTests extends ControllerTestCase {
    @MockBean
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/UCSBOrganization/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/UCSBOrganization/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/UCSBOrganization/all"))
                            .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
            mockMvc.perform(get("/api/UCSBOrganization?orgCode=cdp"))
                            .andExpect(status().is(403)); // logged out users can't get by id
    }
    
    // Authorization tests for /api/UCSBOrganization/post
    // (Perhaps should also have these for put and delete)

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/UCSBOrganization/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/UCSBOrganization/post"))
                            .andExpect(status().is(403)); // only admins can post
    }


    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsborganizations() throws Exception {

                // arrange

                UCSBOrganization vsa = UCSBOrganization.builder()
                                .orgCode("VSA")
                                .orgTranslationShort("VIETNAMESE STUDENT")
                                .orgTranslation("VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(false)
                                .build();

                UCSBOrganization ieee = UCSBOrganization.builder()
                                .orgCode("IEEE")
                                .orgTranslationShort("INSTITUTION OF ELECTRICAL")
                                .orgTranslation("INSTITUTE OF ELECTRICAL AND ELECTRONIC ENGINEERS")
                                .inactive(false)
                                .build();

                ArrayList<UCSBOrganization> expectedOrganizations = new ArrayList<>();
                expectedOrganizations.addAll(Arrays.asList(vsa, ieee));

                when(ucsbOrganizationRepository.findAll()).thenReturn(expectedOrganizations);

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBOrganization/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedOrganizations);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                UCSBOrganization org = UCSBOrganization.builder()
                                .orgCode("VSA")
                                .orgTranslationShort("VIETNAMESE STUDENT")
                                .orgTranslation("VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(false)
                                .build();


                when(ucsbOrganizationRepository.findById(eq("VSA"))).thenReturn(Optional.of(org));

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBOrganization?orgCode=VSA"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findById(eq("VSA"));
                String expectedJson = mapper.writeValueAsString(org);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ucsbOrganizationRepository.findById(eq("VSA"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBOrganization?orgCode=VSA"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findById(eq("VSA"));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBOrganization with id VSA not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_organization() throws Exception {
                // arrange

                UCSBOrganization vsa = UCSBOrganization.builder()
                                .orgCode("VSA")
                                .orgTranslationShort("VIETNAMESE STUDENT")
                                .orgTranslation("VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(true)
                                .build();

                when(ucsbOrganizationRepository.save(eq(vsa))).thenReturn(vsa);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/UCSBOrganization/post?orgCode=VSA&orgTranslationShort=VIETNAMESE STUDENT&orgTranslation=VIETNAMESE STUDENT ASSOCIATION&inactive=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).save(vsa);
                String expectedJson = mapper.writeValueAsString(vsa);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_org() throws Exception {
                // arrange

                UCSBOrganization vsaOrig = UCSBOrganization.builder()
                                .orgCode("VSA")
                                .orgTranslationShort("VIETNAMESE STUDENT")
                                .orgTranslation("VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(true)
                                .build();

                UCSBOrganization vsaEdited = UCSBOrganization.builder()
                                .orgCode("vSA")
                                .orgTranslationShort("VIETNAMESE STUDENTS")
                                .orgTranslation("UCSB VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(false)
                                .build();

                String requestBody = mapper.writeValueAsString(vsaEdited);

                when(ucsbOrganizationRepository.findById(eq("VSA"))).thenReturn(Optional.of(vsaOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/UCSBOrganization?orgCode=VSA")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("VSA");
                verify(ucsbOrganizationRepository, times(1)).save(vsaEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_org_that_does_not_exist() throws Exception {
                // arrange

                UCSBOrganization editedOrg = UCSBOrganization.builder()
                                .orgCode("VSA")
                                .orgTranslationShort("VIETNAMESE STUDENT")
                                .orgTranslation("VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(false)
                                .build();

                String requestBody = mapper.writeValueAsString(editedOrg);

                when(ucsbOrganizationRepository.findById(eq("VSA"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/UCSBOrganization?orgCode=VSA") // put vsa into mock database table
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("VSA");
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id VSA not found", json.get("message"));

        }

        // delete tests
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_an_org() throws Exception {
                // arrange

                UCSBOrganization vsa = UCSBOrganization.builder()
                                .orgCode("VSA")
                                .orgTranslationShort("VIETNAMESE STUDENT")
                                .orgTranslation("VIETNAMESE STUDENT ASSOCIATION")
                                .inactive(false)
                                .build();

                when(ucsbOrganizationRepository.findById(eq("VSA"))).thenReturn(Optional.of(vsa));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/UCSBOrganization?orgCode=VSA")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("VSA");
                verify(ucsbOrganizationRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id VSA deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_org_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(ucsbOrganizationRepository.findById(eq("VSA"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/UCSBOrganization?orgCode=VSA")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("VSA");
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id VSA not found", json.get("message"));
        }
}